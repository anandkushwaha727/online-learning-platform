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
export {registerTeacher,loginTeacher}