import csvParser from "csv-parser";
import fs from "fs";
import Company from "../models/CompanyExamModel.js";
import mongoose from "mongoose";
export async function manualQuizGenerator(req, res) {
    
    try {
        const { grade, subject, totalQuestions, maxScore, difficulty, title, duration } = req.body;
        if(!req.file)
        {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const results = [];
        fs.createReadStream(req.file.path).pipe(csvParser()).on('data',(row)=>
            {
                let obj={
                    id:row.id,
                    question_text:row.question,
                    options:[
                        row['option a'],
                        row['option b'],
                        row['option c'],
                        row['option d']
                    ],
                    correct_answer:row['right answer']
                }

                results.push(obj);
            }
        ).on('end', async () => {
            const quizId = new mongoose.Types.ObjectId();
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
            questions:results
            // eligibleStudents: eligibleStudentIds,
          };

          const updatedCompany = await Company.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { exams: exam } },
            { new: true }
          );
      
          if (!updatedCompany) {
            return res.status(400).json({ message: 'Company not found' });
          }
      
          console.log(updatedCompany);
          res.status(200).json({ message:'file uploaded successfully',quiz: results });



    });

    }
    catch(e)
    {
        res.status(500).json({ message: "Error in generating data", error: e.message });
    }
}