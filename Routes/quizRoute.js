// routes/quizRoutes.js
import express from 'express';
import { generate } from '../controller/GenerateAiQuizController.js';
import { authenticateToken } from '../middleware/authmiddleware.js';
import { evaluate } from '../controller/evaluateController.js';
import { getAllQuizzes } from '../controller/getAllExamsController.js';
import { manualQuizGenerator } from '../controller/ManualQuizGeneratorController.js';
import { updatePassword } from '../controller/StudentAuthController.js';
import { uploadCSV } from '../controller/csvController.js';
import { getQuiz } from '../controller/getAllExamsController.js';
import multer from 'multer';
const router = express.Router();
const upload=multer({dest:'CSVFiles/'})


router.post('/aiquiz/generate', authenticateToken,generate)
router.post('/quiz/submit', authenticateToken,evaluate)
router.get('/quiz/getAll', authenticateToken,getAllQuizzes)
router.post('/quiz/generate',authenticateToken,upload.single('file'),authenticateToken,manualQuizGenerator)
router.post('/uploadMails', upload.single('file'), authenticateToken,uploadCSV);
router.post('/updatePassword',updatePassword)
router.post('/quiz/get',getQuiz)
let quizRoute=router
export default quizRoute;
