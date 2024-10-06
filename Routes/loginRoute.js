// routes/authRoutes.js
import express from 'express';
import { companyRegister } from '../controller/CompnayAuthController.js';
import { studentRegister } from '../controller/StudentAuthController.js';
const router = express.Router();


router.post('/company/login', companyRegister);
router.post('/student/login', studentRegister);
let authRouter=router
export default authRouter;