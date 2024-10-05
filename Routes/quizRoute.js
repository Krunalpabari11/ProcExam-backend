// routes/quizRoutes.js
// import express from 'express';
// import { generate } from '../controller/quizAiController.js';
// import { authenticateToken } from '../middleware/authmiddleware.js';
// import { evaluate } from '../controller/evaluateController.js';
// import { filteration } from '../controller/filterController.js';
// import { getAllSubmissionForQuizID, getQuizQuestionData } from '../controller/historyController.js';
// import { getAllQuizzes } from '../controller/getAllController.js';
// import { hint } from '../controller/hintController.js';

// const router = express.Router();

// router.post('/generateQuiz', authenticateToken, generate);
// router.post('/evaluate', authenticateToken, evaluate);
// router.get('/filter', authenticateToken, filteration);
// router.get('/:quizId/allSubmission', authenticateToken, getAllSubmissionForQuizID);
// router.get('/getAllSubmission', authenticateToken, getAllQuizzes);
// router.get('/:quizId/retry', authenticateToken, getQuizQuestionData);
// router.get('/hint/:quizId/:questionId', authenticateToken, hint);
// let quizRoute=router
// export default quizRoute;
