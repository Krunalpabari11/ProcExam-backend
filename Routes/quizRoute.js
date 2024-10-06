// routes/quizRoutes.js
import express from 'express';
import { generate } from '../controller/GenerateAiQuizController.js';
import { authenticateToken } from '../middleware/authmiddleware.js';
import { evaluate } from '../controller/evaluateController.js';
const router = express.Router();

router.post('/quiz/generate', authenticateToken,generate)
router.post('/quiz/submit', authenticateToken,evaluate)
let quizRoute=router
export default quizRoute;
