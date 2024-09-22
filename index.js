import express from 'express';
import { DBConnect } from './config/databaseconn.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json'assert { type: 'json' };
import quizRoute from './Routes/quizRoute.js';
import authRouter from './Routes/loginRoute.js';
const app = express();
// swaggerConfig(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cookieParser());
DBConnect();

// Authentication Routes
app.use('/api/auth', authRouter);

// Quiz-related Routes
app.use('/api/quiz', quizRoute);

app.listen(5000, () => {
    console.log("server listening on 5000");
});
