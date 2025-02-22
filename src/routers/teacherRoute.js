import express from "express";
import {authenticateUser} from "../middlewares/verifyJwtMiddleware.js";
import { loginTeacher, registerTeacher,getTeacherProfile,updateTeacherProfile,updateTeacherPassowrd,logoutTeacher } from "../controllers/teacherController.js";
const teacherRouter=express.Router();
teacherRouter.post("/register", registerTeacher);
teacherRouter.post("/login", loginTeacher);
teacherRouter.post("/logout", authenticateUser, logoutTeacher);

// Teacher profile routes
teacherRouter.get("/profile", authenticateUser, getTeacherProfile);
teacherRouter.put("/profile/update", authenticateUser, updateTeacherProfile); // Ensure it's PUT method

// Teacher password update
teacherRouter.put("/profile/update-password", authenticateUser, updateTeacherPassowrd);


export {teacherRouter};