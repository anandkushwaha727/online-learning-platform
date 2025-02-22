import express from "express";
import { loginStudent, registerStudent,getStudentProfile,updateStudentProfile,updateStudentPassowrd,logoutStudent } from "../controllers/studentController.js";
import { authenticateUser } from "../middlewares/verifyJwtMiddleware.js";
const studentRouter = express.Router();

studentRouter.post("/login", loginStudent);
studentRouter.post("/register", registerStudent);

studentRouter.post("/logout", authenticateUser, logoutStudent);


studentRouter.get("/profile", authenticateUser, getStudentProfile);
studentRouter.put("/profile/update", authenticateUser, updateStudentProfile); // Ensure it's PUT method


studentRouter.put("/profile/update-password", authenticateUser, updateStudentPassowrd);


export { studentRouter };
