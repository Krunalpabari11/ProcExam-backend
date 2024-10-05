// Warning Schema (Sub-document for Student's exam_given)
const WarningSchema = new Schema({
    multiple_face_detection: [Date],
    tab_changed: [Date],
    face_not_visible: [Date]
  });
  
  // Response Schema (Sub-document for Student's exam_given)
  const ResponseSchema = new Schema({
    question_index: Number,
    selected_answer: String
  });
  
  // Exam Given Schema (Sub-document for Student)
  const ExamGivenSchema = new Schema({
    quiz_id: { type: Schema.Types.ObjectId, ref: 'Company.exams' },
    start_time: Date,
    end_time: Date,
    responses: [ResponseSchema],
    total_score: Number,
    warnings: WarningSchema
  });
  
  // Student Schema
  const StudentSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    exams_given: [ExamGivenSchema]
  });

  let Student;
  try{
    Student=mongoose.model('Student');
  }
  catch{
  
    Student=mongoose.model('Student',StudentSchema);
  }
  module.exports = {  Student };