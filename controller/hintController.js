import Quiz from '../models/quizModel.js';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.apikey });

export async function hint(req, res) {
    try {
        const { quizId, questionId } = req.params;
        const quiz = await Quiz.findOne({ quizId });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const question = quiz.quizContent.find(q => q.id === parseInt(questionId));
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const chatCompletion = await getGroqChatCompletion(question.question);
        let hint = chatCompletion.choices[0]?.message?.content || "No hint available";
        hint = hint.replace(/\n/g, ' ');
        res.status(200).json({ hint });
    } catch (error) {
        res.status(500).json({ message: 'Error generating hint', error: error.message });
    }
}

async function getGroqChatCompletion(question) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Provide a hint for the following question: "${question}"`,
            },
        ],
        model: "llama3-8b-8192",
    });
}
