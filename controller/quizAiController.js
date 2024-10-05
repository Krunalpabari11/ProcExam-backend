import Quiz from "../models/CompanyExamModel.js";
import Groq from "groq-sdk";
import mongoose from "mongoose";

const groq = new Groq({ apiKey: process.env.apikey });

export async function generate(req, res) {
    const { grade, Subject, TotalQuestions, MaxScore, Difficulty } = req.body;

    const chatCompletion = await getGroqChatCompletion(grade, Subject, TotalQuestions, MaxScore, Difficulty);
    
    const data = (chatCompletion.choices[0]?.message?.content || "");
    const jsonMatch = data.match(/\[.*\]/s);
    let quizContent = [];

    if (jsonMatch) {
        try {
            quizContent = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error("Error parsing quiz content:", e);
        }
    }


    const quizId = new mongoose.Types.ObjectId().toString();

    try {
        const newQuiz = new Quiz({
            quizId,
            grade:grade,
            subject:Subject,
            totalQuestions:TotalQuestions,
            maxScore:MaxScore,
            difficulty:Difficulty,
            username: req.user.username,
            quizContent,
            currentScore: null, 
            lastCompletedAt:null 
        });

        const savedQuiz = await newQuiz.save();
        const sanitizedQuizContent = quizContent.map(({ answer, ...rest }) => rest);

        res.status(200).json({ quizId, questions: sanitizedQuizContent });
    } catch (e) {
        res.status(500).json({ message: "Error in generating data", error: e.message });
    }
}

export async function getGroqChatCompletion(grade, Subject, totalQuestions, MaxScore, Difficulty) {
    const content = `Generate a ${Subject} quiz for grade ${grade} with ${totalQuestions} questions in JSON format. Each question should have the following structure: 
  { "id":autoincrement start from 1
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "answer": "correct option"
  }.
  Ensure Difficulty level is set to ${Difficulty}. Maximum score: ${MaxScore}.`;

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
