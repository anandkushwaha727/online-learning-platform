import express from "express";
import { loginStudent, registerStudent } from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/login", loginStudent);
studentRouter.post("/register", registerStudent);

export { studentRouter };
