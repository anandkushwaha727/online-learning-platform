
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
export {registerStudent,loginStudent}