const user = require("../models/user");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")
const crypto = require("crypto");
exports.resetPasswordToken = async (req, res) => {
  //find mail
  //check user
  //generate token
  //update token to the user
  //create url
  //send url
  //return response

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "user is not registered",
        success: false,
      });
    }

    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpireIn: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );

    const url = `http://localhost:5173/update-password/${token}`;

    await mailSender(
      email,
      "Password reset link",
      `paasword reset link: ${url}`
    );

    return res.status(200).json({
      message: "email send succsessfully check mail and reset passwoed",
      success: true,
    //   updatedDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while reseting the passwoed",
      success: false,
    });
  }
};


exports.resetPassword = async(req , res)=>{
    //fetch data
    //validate
    //find token
    //serach user
    // if not tokem  or expire time of token 
    // hash password 
    // update password 

    
    try{
const {token, password, confirmPassword }= req.body

    if(password!==confirmPassword){
        return res.status(400).json({
            message:"password not matching",
            success:false
        })
    }

    const userDetails = await User.findOne({token:token})

    if(!userDetails){
        return res.status(403).json({
            message:"user is not preasent",
            success:false,
        })
    }

    if(userDetails.resetPasswordExpireIn < Date.now()){
        return res.status(302).json({
            success:false,
            message:"token is expires"
        })
    }

    const hashpassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate({token},{
        password:hashpassword,
        token: undefined,
    resetPasswordExpireIn: undefined,
    },{
        new:true
    })


    return res.status(200).json({
        message:"password is reset ",
        success:true,
    })

    }catch(error){
return res.status(503).json({
    message:"error at the time of reset",
    success:false,
})
    }

}