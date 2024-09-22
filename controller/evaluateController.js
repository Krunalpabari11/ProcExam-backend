import Quiz from "../models/quizModel.js";
import nodemailer from 'nodemailer';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.apikey });
export async function evaluate(req, res) {
    try {
        const { quizId, responses,email } = req.body;
        const storedQuiz = await Quiz.findOne({ quizId,username:req.user.username });

        if (!storedQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const score = evaluateScore(storedQuiz.quizContent, responses,storedQuiz);
        const completedAt = new Date();

        storedQuiz.oldSubmissions.push({
            responses,
            score,
            completedAt
        });
        storedQuiz.currentScore = score;
        storedQuiz.lastCompletedAt = completedAt;

        await storedQuiz.save();
        if(email){
        mailSender(score,storedQuiz.maxScore,email,storedQuiz)
        }
        res.status(200).json({
            message: "Quiz evaluated successfully",
            yourScore: score
        });
    } catch (error) {
        res.status(500).json({ message: "Error evaluating quiz", error: error.message });
    }
}

function evaluateScore(quizContent, responses,storedQuiz) {
    let score = 0;

    responses.forEach((response) => {
        const storedQuestion = quizContent.find(
            (q) => q.id === Number(response.questionId)
        );

        const optionIndex = ["A", "B", "C", "D"].indexOf(response.userResponse);
        if (optionIndex !== -1 && storedQuestion) {
            const userAnswer = storedQuestion.options[optionIndex];
            if (userAnswer === storedQuestion.answer) {
                score++;
            }
        }
    });

    let diffScore=(score/storedQuiz.totalQuestions)*storedQuiz.maxScore

    return diffScore;
}
async function mailSender(score,maxScore,email,storedQuiz)
{
    const chatCompletion = await getGroqChatCompletion(score,storedQuiz);
    const data = (chatCompletion.choices[0]?.message?.content || "");
    console.log(data)
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: 'Your Recent Test Score',
        text: `You scored ${score} out of ${maxScore}. Here are some suggestions on how to improve:\n\n${data}`, 
    };
    

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error.message);
    }
}

async function getGroqChatCompletion(score, storedQuiz) {
    const content = `I scored ${score} out of ${storedQuiz.maxScore} on a ${storedQuiz.subject} quiz for grade ${storedQuiz.grade}. Based on this score, provide suggestions on how the user can improve in the following areas: 
    - ${storedQuiz.quizContent.map(q => q.question).join(", ")}. Give only 2-3 points About where can i improve`;

    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: content,
            },
        ],
        model: "llama3-8b-8192",
    });
}


