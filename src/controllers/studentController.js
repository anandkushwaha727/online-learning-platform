
import studentModel from '../models/studentModel.js';
import { ApiResponse } from '../utils/apiResponseUtility.js';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/apiErrorUtility.js';
import { asyncHandler } from '../utils/asyncHandlerUtility.js';

const registerStudent =asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        // return res.status(400).json(new ApiResponse(400,null,"Please provide all the details"))
        throw new ApiError(400,"Please provide all the details")
       
    }
    const checkExistingStudent= await studentModel.findOne({
        email
    });
    if(checkExistingStudent){
        // return res.status(400).json(new ApiResponse(400,null,"Student already exists with this email"))
        throw new ApiError(400,"Student already exists with this email")
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        
    }
    const hashedPassword = await bcrypt.hash(password, 12);
const newStudent = await studentModel.create({
    name,
    email,
    password
});

    const accessToken=newStudent.generateAccessToken();
    const refreshToken=newStudent.generateRefreshToken();
    res.status(201).json(new ApiResponse(201,{accessToken,refreshToken,name,email},"Student registered successfully"))

  
})
const loginStudent =asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    console.log(email,password)
    if(!email || !password){
     
        throw new ApiError(400,"Please provide all the details")
    }
    const studentExistOrNot = await studentModel.findOne({ email });

    if(!studentExistOrNot){
        throw new ApiError(400,"Student does not exist with this email")
    }
    const isPasswordCorrect=await studentExistOrNot.isPasswordCorrect(password);
    console.log("Entered Password:", password);
    console.log("Stored Password:", studentExistOrNot.password);
    if(!isPasswordCorrect){


        return res.status(400).json(new ApiResponse(400,null,"Invalid credentials"))
    }
    const accessToken=studentExistOrNot.generateAccessToken();
    const refreshToken=studentExistOrNot.generateRefreshToken();
    res.status(200).json(new ApiResponse(200,{accessToken,refreshToken,studentExistOrNot},"Student logged in successfully"))

})
const getStudentProfile =asyncHandler(async(req,res)=>{
    try {
        const Student = await studentModel.findById(req.user._id).select("-password");
        if (!Student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ success: true, data: Student });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
);
const updateStudentProfile = asyncHandler (async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log(name,email)
        console.log(req.user._id)
        const Student = await studentModel.findById(req.user._id);

        if (!Student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Prevent email change if needed
        if (email && email !== Student.email) {
            const emailExists = await StudentModel.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            Student.email = email;
        }

        if (name) Student.name = name;
       

        await Student.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: Student,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
const updateStudentPassowrd =asyncHandler(async(req,res)=>{
    const {newpassword,oldpassword}=req.body;
    if(!newpassword || !oldpassword){
        throw new ApiError(400,"Please provide all the details")
    }
    const Student = await studentModel.findById(req.user._id);
    if(!Student){
        throw new ApiError(404,"Student not found")
    }
    const isPasswordCorrect=await Student.isPasswordCorrect(oldpassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid credentials")
    }
    Student.password=newpassword;
    await Student.save();
    res.status(200).json(new ApiResponse(200,null,"Password updated successfully"))
});

const logoutStudent = asyncHandler(async (req, res) => {
    const { role } = req; // Extracting role from `authenticateUser` middleware

    let Model;
    if (role === "Student") {
        Model = studentModel;
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


export {registerStudent,loginStudent,getStudentProfile,updateStudentProfile,updateStudentPassowrd,logoutStudent}