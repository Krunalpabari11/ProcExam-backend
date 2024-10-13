import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import Company from '../models/CompanyExamModel.js';
import Student from '../models/StudentExamModel.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (email, examId) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invitation for Assessment',
    text: `Your Exam ID is: ${examId}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error while sending mail:', error);
    }
    console.log(`Email sent to ${email}: ${info.response}`);
  });
};

export  function uploadCSV(req,res) {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const quizId = req.body.quizId;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = req.file.path

  const emails = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      if (row.email) {

        emails.push(row.email);
      }
    })
    .on('end', async() => {
      const examId = quizId; 
      const studentId=[]

      emails.map(async(email) => {
        const student=await Student.find({email:email})


         if(student.length>0)
        {
          studentId.push(student[0]._id)
          
        }
        else{

          const newStudent=new Student({
            email:email
          })

          newStudent.save()
          studentId.push(newStudent._id)
        }
        sendEmail(email, examId)
      });

        const company=await Company.findOne({_id:req.user.id})
        const data= company.exams.filter(exams=>exams.quiz_id.toString()===quizId.toString())
        data[0].eligibleStudents=studentId


        const updatecompany=await company.save()



        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file');
          }

          res.status(200).json({ message: 'CSV file processed and emails sent' });
        });


    })
    .on('error', (err) => {
      console.error('Error reading the CSV file:', err);
      res.status(500).json({ message: 'Error processing file' });
    });
};
