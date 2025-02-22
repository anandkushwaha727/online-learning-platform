import jwt from "jsonwebtoken";
import Teacher from "../models/teacherModel.js"

import Student from '../models/studentModel.js'; // Adjust the path as needed

import { ApiError } from "../utils/apiErrorUtility.js";
import { asyncHandler } from "../utils/asyncHandlerUtility.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
    console.log("Headers received:", req.headers);  // 🔹 Debugging line

    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
        throw new ApiError(401, "Access denied. No token provided");
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.ACCESS_TOKEN_SECRET);
        let user = await Teacher.findById(decoded._id).select("-password"); 
        let role = "teacher";

        if (!user) {
            user = await Student.findById(decoded._id).select("-password"); 
            role = "student";
        }

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;
        req.role = role;

        next();
    } catch (error) {
        throw new ApiError(403, "Invalid or expired token");
    }
});
export {authenticateUser}