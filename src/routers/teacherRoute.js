import express from "express";
import { authenticateUser } from "../middlewares/verifyJwtMiddleware.js";
import {
  loginTeacher,
  registerTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  updateTeacherPassowrd,
  logoutTeacher,
} from "../controllers/teacherController.js";
import {
  createCourse,
  updateCourse,
  getAllCourses,
  getCoursesByTeacher,
  getCourseById,
  deleteCourse,
} from "../controllers/courseController.js";
const teacherRouter = express.Router();
teacherRouter.post("/register", registerTeacher);
teacherRouter.post("/login", loginTeacher);
teacherRouter.post("/logout", authenticateUser, logoutTeacher);

// Teacher profile routes
teacherRouter.get("/profile", authenticateUser, getTeacherProfile);
teacherRouter.put("/profile/update", authenticateUser, updateTeacherProfile); // Ensure it's PUT method

// Teacher password update
teacherRouter.put(
  "/profile/update-password",
  authenticateUser,
  updateTeacherPassowrd
);

// teacher courses
teacherRouter.post("/course", authenticateUser, createCourse);
teacherRouter.put("/course/update/:id", authenticateUser, updateCourse);
teacherRouter.get("/course/getall", getAllCourses); // Get all courses
teacherRouter.get("/course/teacher", authenticateUser, getCoursesByTeacher); // Get courses by teacher
teacherRouter.get("/course/:id", authenticateUser, getCourseById); // Get single course
teacherRouter.delete("/course/delete/:id", authenticateUser, deleteCourse);
export { teacherRouter };
