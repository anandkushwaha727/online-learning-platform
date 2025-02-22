import express from "express";
import { loginTeacher, registerTeacher } from "../controllers/teacherController.js";
const teacherRouter=express.Router();
teacherRouter.post("/register",registerTeacher);
teacherRouter.post("/login",loginTeacher);  
export {teacherRouter};