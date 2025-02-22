
import dotenv from "dotenv";
import {dbConnection} from "./src/dataBase/dataBase.connection.js";

import {app} from "./app.js";

dotenv.config({
    path: "./.env"
});

dbConnection().then(()=>{
   app.listen(process.env.PORT,()=>{
       console.log(`server is running on port ${process.env.PORT}`);
   })
}).catch((error)=>{
    console.log("Error while connecting to database");
    console.log(error);
})


