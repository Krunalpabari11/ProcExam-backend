import Company from '../models/CompanyExamModel.js';
import Student from '../models/StudentExamModel.js';
import nodemailer from 'nodemailer';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.apikey });

export async function evaluate(req, res) {
    try {
        const { quizId, responses, warnings } = req.body;

        // Check if the student has already taken this quiz
        const student = await Student.findOne({ _id: req.user.id });
        const alreadyTaken = student.exams_given.some(exam => exam.quiz_id.toString() === quizId);

        if (alreadyTaken) {
            return res.status(400).json({ message: "You have already taken this quiz." });
        }

        // Find the company and quiz
        const storedCompany = await Company.findOne({ 'exams.quiz_id': quizId });
        if (!storedCompany) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const storedQuiz = storedCompany.exams.find((exam) => exam.quiz_id.toString() === quizId);
        if (!storedQuiz) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Evaluate the score
        const score = evaluateScore(storedQuiz.questions, responses, storedQuiz);
        const completedAt = new Date();

        // Create the exam given object
        const examGiven = {
            quiz_id: quizId,
            start_time: completedAt,
            end_time: completedAt,
            responses,
            total_score: score,
            warnings
        };

        // Update the student's exams_given array
        await Student.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { exams_given: examGiven } },
            { new: true }
        );

        res.status(200).json({
            message: "Quiz evaluated successfully",
            yourScore: score
        });
    } catch (error) {
        res.status(500).json({ message: "Error evaluating quiz", error: error.message });
    }
}

function evaluateScore(quizContent, responses, storedQuiz) {
    let score = 0;

    responses.forEach((response) => {
        const storedQuestion = quizContent.find(
            (q) => q.id === Number(response.question_index)
        );

        const optionIndex = ["A", "B", "C", "D"].indexOf(response.selected_answer);
        if (optionIndex !== -1 && storedQuestion) {
            const userAnswer = storedQuestion.options[optionIndex];
            if (userAnswer === storedQuestion.correct_answer) {
                score++;
            }
        }
    });

    let diffScore = (score / storedQuiz.totalQuestions) * storedQuiz.maxScore;

    return diffScore;
}
