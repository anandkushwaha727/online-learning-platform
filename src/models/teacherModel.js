import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    subjectsTaught: [{ type: String, required: true }], 
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    assignmentsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    liveClassSchedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], 
    announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }], 
    resolvedQueries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Query" }],
  }, { timestamps: true });

  teacherSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

teacherSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

teacherSchema.methods.generateAccessToken = function(){
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
teacherSchema.methods.generateRefreshToken = function(){
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


  
export default mongoose.model('teacher', teacherSchema);
  