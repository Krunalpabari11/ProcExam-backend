import Company from "../models/CompanyExamModel.js";
import Groq from "groq-sdk";
import mongoose from "mongoose";

const groq = new Groq({ apiKey: process.env.apikey });


export async function generate(req, res) {
  const {
    grade,
    subject,
    totalQuestions,
    maxScore,
    difficulty,
    title,
    duration,
    eligibleStudents,
  } = req.body;

  const user = req.user; 
  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const chatCompletion = await getGroqChatCompletion(
    grade,
    subject,
    totalQuestions,
    maxScore,
    difficulty
  );

  const data = chatCompletion.choices[0]?.message?.content || "";
  const jsonMatch = data.match(/\[.*\]/s);
  let quizContent = [];

  if (jsonMatch) {
    try {
      quizContent = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Error parsing quiz content:", e);
    }
  }

  const quizId = new mongoose.Types.ObjectId();

  // const eligibleStudentIds = eligibleStudents.map(student => new mongoose.Types.ObjectId(student));

  try {
    const exam = {
      quiz_id: quizId,
      grade,
      subject,
      totalQuestions,
      maxScore,
      difficulty,
      title,
      date: new Date(),
      duration,
      questions: quizContent.map(q => ({
        id: q.id,
        question_text: q.question,
        options: q.options,
        correct_answer: q.answer
      })),
      // eligibleStudents: eligibleStudentIds,
    };

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: user.id },
      { $push: { exams: exam } },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(400).json({ message: 'Company not found' });
    }

    console.log(updatedCompany);
    res.status(200).json({ quiz: quizContent });
  } catch (e) {
    res.status(500).json({ message: "Error in generating data", error: e.message });
  }
}

export async function getGroqChatCompletion(
  grade,
  Subject,
  totalQuestions,
  MaxScore,
  Difficulty
) {
  const content = `Generate a ${Subject} quiz for grade ${grade} with ${totalQuestions} questions in JSON format. Each question should have the following structure: 
  { "id":autoincrement start from 1
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "answer": "correct answer"
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
