import express from 'express';

import { DBConnect } from './config/databaseconn.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
const app = express();
app.use(express.json());
app.use(cookieParser());
DBConnect();


app.listen(5000, () => {
    console.log("server listening on 5000");
});
