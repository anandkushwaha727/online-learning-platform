import mongoose, { mongo }   from "mongoose";
const dbConnection =async()=>{
    try {
        const instanceofmongoose = await mongoose.connect(process.env.MOGODB_URI)
        console.log("database connected successfully");
        console.log(instanceofmongoose.connection.readyState);
    } catch (error) {
        console.log("Error while connecting to database");
        console.log(error);
    }
}
export {dbConnection}