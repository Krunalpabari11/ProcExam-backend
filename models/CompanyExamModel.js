import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Question Schema (Sub-document)
const QuestionSchema = new Schema({
  question_text: String,
  options: [String],
  correct_answer: String
});

// Exam Schema (Sub-document for Company)
const ExamSchema = new Schema({
  quiz_id: Schema.Types.ObjectId,
  title: String,
  description: String,
  date: Date,
  duration: Number, // in minutes
  questions: [QuestionSchema],
  eligible_students: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});

// Company Schema
const CompanySchema = new Schema({
  name: String,
  email: String,
  phone: String,
  exams: [ExamSchema]
});


let Company;
try{
Company=mongoose.model('Company');
}
catch{

 Company=mongoose.model('Company',CompanySchema);
}

module.exports = { Company, Student };