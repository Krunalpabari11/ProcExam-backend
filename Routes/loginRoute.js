// routes/authRoutes.js
import express from 'express';
import { companyRegister } from '../controller/CompnayAuthController.js';
import { studentRegister } from '../controller/StudentAuthController.js';
import { companyLogin } from '../controller/CompnayAuthController.js';
import { studentLogin } from '../controller/StudentAuthController.js';
const router = express.Router();


router.post('/company/register', companyRegister);
router.post('/student/register', studentRegister);
router.post('/company/login', companyLogin);
router.post('/student/login', studentLogin);
let authRouter=router
export default authRouter;