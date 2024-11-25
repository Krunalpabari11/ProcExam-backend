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
export async function getQuiz(req, res) {
    try {
        const quizId=req.body.quizId;
        const data = await Company.find({ });

        for(let i =0 ;i<data.length;i++)
        {
            for(let j=0;j<data[i].exams.length;j++)
            {   console.log(data[i].exams[j].quiz_id)
                if(data[i].exams[j].quiz_id==quizId)
                {
                    var exam=data[i].exams[j].questions;
                    break;
                }
            }
        }


        // console.log(exam+" ljksdflkjsdflksjdfslkdjflskdfj")
        // const exams=data[0].exams;

        if (!exam) {
            return res.status(404).json({ message: "No quiz found for this user." });
        }

        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz", error: error.message });
    }
}
