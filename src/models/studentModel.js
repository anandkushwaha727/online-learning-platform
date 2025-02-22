import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], 
  submittedAssignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
  liveClassAttendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], 
  viewedMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], 
  queries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Query" }], 
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
}, { timestamps: true });

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

studentSchema.methods.isPasswordCorrect = async function(password){
    console.log("Comparing:", password, "with", this.password);
    return await bcrypt.compare(password, this.password);
};


studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export default mongoose.model('Student', studentSchema);