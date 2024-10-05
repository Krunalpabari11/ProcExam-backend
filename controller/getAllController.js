import Quiz from "../models/CompanyExamModel.js";

export async function getAllQuizzes(req, res) {
    try {
        const quizzes = await Quiz.find({ username: req.user.username });
        
        if (!quizzes.length) {
            return res.status(404).json({ message: "No quizzes found for this user." });
        }

        res.status(200).json({length:quizzes.length,data:quizzes});
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes", error: error.message });
    }
}
