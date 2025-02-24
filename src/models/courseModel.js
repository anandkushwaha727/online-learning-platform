import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    division: { type: String, required: true },
    className: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    studentsEnrolled: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    ],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    recordedLectures: [{ type: String }], // Array of video URLs (Cloudinary)
  },
  { timestamps: true }
);
export default mongoose.model("Course", courseSchema);
