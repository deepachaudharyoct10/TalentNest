const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DataBase is connected Successfully")
    }catch(error){
        console.log("Error is ",error);
        console.log("Error in connecting Database");
    }
}