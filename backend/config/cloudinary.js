const cloudinary = require("cloudinary").v2;
require("dotenv").config();
exports.CloudinaryDB = async()=>{
    try{
        cloudinary.config({cloud_name:process.env.CLOUD_NAME, api_key:process.env.API_KEY,api_secret: process.env.API_SECRET})
        console.log("coudinary is connected")
    }catch(errro){
        console.log("eoorr in connecting cloudingary");

    }
}