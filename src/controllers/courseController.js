import courseModel from "../models/courseModel.js";
import { asyncHandler } from "../utils/asyncHandlerUtility.js";
import { ApiResponse } from "../utils/apiResponseUtility.js";
import { ApiError } from "../utils/apiErrorUtility.js";
import teacherModel from "../models/teacherModel.js";

const createCourse = asyncHandler(async (req, res) => {
  try {
    const { title, division, className } = req.body;
    const teacherId = req.user.id; // ✅ Get authenticated teacher ID from JWT

    // ✅ Validate required fields
    if (!title || !division || !className) {
      throw new ApiError(400, "Please provide all fields");
    }

    // ✅ Check if teacher exists
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Teacher does not exist"));
    }

    // ✅ Check if the course already exists for the same teacher, class, and division
    const existingCourse = await courseModel.findOne({
      title,
      className,
      division,
      teacher: teacherId,
    });
    if (existingCourse) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Course already exists"));
    }

    // ✅ Create new course
    const newCourse = await courseModel.create({
      title,
      className,
      division,
      teacher: teacherId,
      studentsEnrolled: [],
      assignments: [],
      recordedLectures: [],
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newCourse, "Course created successfully"));
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});
const updateCourse = asyncHandler(async (req, res) => {
  const { title, division, className } = req.body;
  const teacherId = req.user.id;
  const courseId = req.params.id;
  if (!title || !division || !className) {
    throw new ApiError(400, "Please provide all fields");
  }
  const teacher = await teacherModel.findById(teacherId);
  if (!teacher) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Teacher does not exist"));
  }
  const course = await courseModel.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Course does not exist"));
  }
  if (course.teacher.toString() !== teacherId) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Not authorized to update this course"));
  }
  const updatedCourse = await courseModel.findByIdAndUpdate(
    courseId,
    { title, division, className },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedCourse, "Course updated successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await courseModel.find().populate("teacher", "name email"); // Ensure 'name' and 'email' exist in the Teacher model

  if (!courses || courses.length === 0) {
    throw new ApiError(404, "No courses found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses retrieved successfully"));
});

const getCoursesByTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const courses = await courseModel.find({ teacher: teacherId });

  if (!courses || courses.length === 0) {
    throw new ApiError(404, "No courses found for this teacher");
  }

  res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses retrieved successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseModel
    .findById(req.params.id)
    .populate("teacher", "name email")
    .populate("studentsEnrolled", "name email");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, course, "Course retrieved successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const teacherId = req.user._id; // Extracted from JWT
  const course = await courseModel.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Ensure the logged-in teacher is the owner
  if (course.teacher.toString() !== teacherId.toString()) {
    throw new ApiError(403, "You can only delete your own courses");
  }

  await courseModel.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
});
export {
  createCourse,
  updateCourse,
  getAllCourses,
  getCoursesByTeacher,
  getCourseById,
  deleteCourse,
};
