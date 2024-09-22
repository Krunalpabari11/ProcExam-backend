import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    quizId: { type: String, required:true },  
    grade: { type: Number, required: true },
    subject: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
    username: { type: String, required: true },  
    currentScore:{type:Number},
    quizContent: { type: Array, required: true },
    oldSubmissions: [{ 
     responses: [{ questionId: String, userResponse: String }],
     score: Number,
     completedAt: Date
 }],
    createdAt: { type: Date, default: Date.now },
    lastCompletedAt: { type: Date }
});


var Quiz
try{
     Quiz = mongoose.model('Quiz');
}
catch{
     Quiz = mongoose.model('Quiz', quizSchema);
}

export default Quiz;
