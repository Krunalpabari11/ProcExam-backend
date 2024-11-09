import express from 'express';

import { DBConnect } from './config/databaseconn.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRouter from './Routes/loginRoute.js';
import quizRoute from './Routes/quizRoute.js';
import cors from 'cors'
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',  // Specify your frontend origin
  credentials: true,                // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());
DBConnect();

app.use('/auth', authRouter);
app.use('/api', quizRoute);
app.listen(5000, () => {
    console.log("server listening on 5000");
});
