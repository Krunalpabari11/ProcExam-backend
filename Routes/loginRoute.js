// routes/authRoutes.js
import express from 'express';
import { login } from '../controller/authController.js';

const router = express.Router();


router.post('/login', login);

let authRouter=router
export default authRouter;