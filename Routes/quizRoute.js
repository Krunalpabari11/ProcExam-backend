// routes/quizRoutes.js
import express from 'express';
import { generate } from '../controller/GenerateAiQuizController.js';
import { authenticateToken } from '../middleware/authmiddleware.js';
import { evaluate } from '../controller/evaluateController.js';
import { getAllQuizzes } from '../controller/getAllExamsController.js';
import { manualQuizGenerator } from '../controller/ManualQuizGeneratorController.js';
import multer from 'multer';
const router = express.Router();
const upload=multer({dest:'CSVFiles/'})

router.post('/aiquiz/generate', authenticateToken,generate)
router.post('/quiz/submit', authenticateToken,evaluate)
router.get('/quiz/getAll', authenticateToken,getAllQuizzes)
router.post('/quiz/generate',authenticateToken,upload.single('file'),manualQuizGenerator)
let quizRoute=router
export default quizRoute;
