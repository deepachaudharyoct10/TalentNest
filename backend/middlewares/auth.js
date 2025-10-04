const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { Suspense } = require("react");

exports.Auth = async (req, res, next) => {
  try {

    const token =
      req.body.token ||
      req.cookies.token ||
      req.headers["Authentication"].replace("Bearer", "");

    console.log("req is body", req.body);
    console.log("cookies ", req.cookies);
    console.log("header", token);

    if(!token ){
        return res.status(403).json({
            messages:"token is missing",
            success:false,
        })
    }
    const decode = jwt.verify(token,process.env.JWT_TOKEN);

    if (!decode) {
      res.status(400).json({
        message: "token is not present",
        success: false,
      });
    }
    req.user = decode;
    next();
  } catch (error) {
    console.log("Error at the time of authentication", error);
    res.status(400).json({
      message: "Error at the time of authentication",
      success: false,
    });
  }
};

exports.isStudent = async( req , res , next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(403).json({
                message:"this is a protectd outes",
                success:false,
            })
        }
        next();
    }catch(errro){
        console.log("error at the time of student authentication",eror);
        return res.status(500).json({
            message:"authentication error",
            success:false,
        })
    }
}
exports.isInstructor = async( req , res , next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(403).json({
                message:"this is a protectd outes",
                success:false,
            })
        }
        next();
    }catch(errro){
        console.log("error at the time of Instructor authentication",eror);
        return res.status(500).json({
            message:"authentication error",
            success:false,
        })
    }
}
exports.isAdmin = async( req , res , next)=>{
    try{
        if(req.user.accountType!=="Admin "){
            return res.status(403).json({
                message:"this is a protectd outes",
                success:false,
            })
        }
        next();
    }catch(errro){
        console.log("error at the time of Admin  authentication",eror);
        return res.status(500).json({
            message:"authentication error",
            success:false,
        })
    }
}