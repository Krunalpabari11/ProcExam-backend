import Company from "../models/CompanyExamModel.js";

export async function getAllQuizzes(req, res) {
    try {

        const data = await Company.find({ _id: req.user.id });
        console.log(data[0].exams)

        const exams=data[0].exams;
        if (!exams.length) {
            return res.status(404).json({ message: "No quizzes found for this user." });
        }

        res.status(200).json({length:exams.length,data:exams});
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes", error: error.message });
    }
}
