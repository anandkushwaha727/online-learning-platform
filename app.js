import express from 'express';
const app=express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import {studentRouter}  from "./src/routers/studentRoutes.js";
import {errorMiddleware} from "./src/middlewares/apiErrorMiddleware.js";
import {teacherRouter} from "./src/routers/teacherRoute.js"
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/teacher',teacherRouter);
app.use(errorMiddleware);
export {app}