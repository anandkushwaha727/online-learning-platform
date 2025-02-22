import { ApiResponse} from "../utils/apiResponseUtility.js";
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/apiErrorUtility.js';
import { asyncHandler } from '../utils/asyncHandlerUtility.js';
import teacherModel from '../models/teacherModel.js';


const registerTeacher=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new ApiError(400,"Please provide all the details")
    }
    const checkExistingTeacher= await teacherModel.findOne({
        email
    });
    if(checkExistingTeacher){
        throw new ApiError(400,"Teacher already exists with this email")
    }
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    

    const hashedPassword = await bcrypt.hash(password, 12);
    const newTeacher =await teacherModel.create({
        name,
        email,
        password
    })
    const accessToken=newTeacher.generateAccessToken();
    const refreshToken=newTeacher.generateRefreshToken();   
    res.status(201).json(new ApiResponse(201,{accessToken,refreshToken,name,email},"Teacher registered successfully"))
}
)
const loginTeacher=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError(400,"Please provide all the details")
    }
    const teacherExistOrNot = await teacherModel.findOne({ email });

    if(!teacherExistOrNot){
        throw new ApiError(400,"Teacher does not exist with this email")
    }
    const isPasswordCorrect=await teacherExistOrNot.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res.status(400).json(new ApiResponse(400,null,"Invalid credentials"))
    }
    const accessToken=teacherExistOrNot.generateAccessToken();
    const refreshToken=teacherExistOrNot.generateRefreshToken();
    res.status(200).json(new ApiResponse(200,{accessToken,refreshToken,teacherExistOrNot},"Teacher logged in successfully"))

});
const getTeacherProfile =asyncHandler(async(req,res)=>{
    try {
        const teacher = await teacherModel.findById(req.user._id).select("-password");
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
);
const updateTeacherProfile = asyncHandler (async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log(name,email)
        console.log(req.user._id)
        const teacher = await teacherModel.findById(req.user._id);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Prevent email change if needed
        if (email && email !== teacher.email) {
            const emailExists = await teacherModel.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            teacher.email = email;
        }

        if (name) teacher.name = name;
       

        await teacher.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: teacher,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
const updateTeacherPassowrd =asyncHandler(async(req,res)=>{
    const {newpassword,oldpassword}=req.body;
    if(!newpassword || !oldpassword){
        throw new ApiError(400,"Please provide all the details")
    }
    const teacher = await teacherModel.findById(req.user._id);
    if(!teacher){
        throw new ApiError(404,"Teacher not found")
    }
    const isPasswordCorrect=await teacher.isPasswordCorrect(oldpassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid credentials")
    }
    teacher.password=newpassword;
    await teacher.save();
    res.status(200).json(new ApiResponse(200,null,"Password updated successfully"))
});

const logoutTeacher = asyncHandler(async (req, res) => {
    const { role } = req; // Extracting role from `authenticateUser` middleware

    let Model;
    if (role === "teacher") {
        Model = teacherModel;
    } else {
        throw new ApiError(403, "Invalid role");
    }

    await Model.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }, // Remove refreshToken
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});


export { loginTeacher, registerTeacher,getTeacherProfile,updateTeacherProfile,updateTeacherPassowrd,logoutTeacher}