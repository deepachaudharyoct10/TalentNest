//singup
//otp
//login
//changePassword

const User = require("../models/user");
const OTP = require("../models/otp");
const otpGererator = require("otp-generator");
const otp = require("../models/otp");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.otpSender = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.find({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        message: "User is already registered ! Please login",
        success: false,
      });
    }

    var otp = otpGererator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.find({ otpValue: otp });

    while (result) {
      otp = otpGererator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.find({ otpValue: otp });
    }

    const otpPayload = { email, otpValue: otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("Otp body ", otpBody);

    res.status(200).json({
      message: "OTP verifaication send ",
      success: true,
      data: otpBody,
    });
  } catch (error) {
    console.log("otp error is ", error);
    res.status(500).json({
      message: "Error at the time of otp generated ",
      success: false,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      accountType,
      otpValue,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      email ||
      !password ||
      !confirmPassword ||
      !otpValue
    ) {
      res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        message: "password are not matched",
        success: false,
      });
    }

    const exitUser = await User.find({ email });

    if (exitUser) {
      res.status(403).json({
        message: "User is already exited ! Please login ",
        success: false,
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("otp value recent", recentOtp);
    if (recentOtp.length === 0) {
      return res.status(400).json({
        message: "No otp is generated",
        success: false,
      });
    }
    if (recentOtp.otpValue !== otpValue) {
      return res.status(402).json({
        message: "Invalid otp",
        success: false,
      });
    }

    let hashPassword;
    hashPassword = await bcrypt.hash(password, 10);
    console("hashed password", hashPassword);
    const profileDetails = await Profile.create({
      gender: null,
      dataOfbirth: null,
      about: null,
      contactNumber: null,
      organizationName: null,
    });

    console.log("Pofile details ", profileDetails);

    const userDetails = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    console.log("userDetails", userDetails);

    res.status(200).json({
      message: "user cerated succesfylly",
      success: true,
      data: userDetails,
    });
  } catch (error) {
    console.log("error ata the time of signup ");
    res.status(500).json({
      message: "Error at the tiem of signup",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        message: "All fields are requried",
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        messages: "User is not registered",
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
        message: "Password is not correct",
        success: false,
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };
    const token = await jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });

    console.log("token is", token);

    (user.token = token), (user.password = undefined);
    const options = {
      expires: new Date(Date.now()) + 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    return res.cookie("token", token, options).status(200).json({
      message: "User is login successfully",
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error at the time of login",
      success: false,
    });
  }
};

exports.changePassword = async(req , res)=>{
  const {email,oldPassword, password, confirmPassword}= req.body;

  if(!email || !password || !confirmPassword ||oldPassword){
    return res.status(403).json({
      message:"All field are requred",
      success:false,
    })
  }

  const user = await User.findOne({email});

  if(!user){
    return res.status(403).json({
      message:"User is not regisetedd",
      success:false,
    })
  }

  const checkPassword = await bcrypt.compare(oldPassword, user.password)
  if(!checkPassword){
    return res.status(403).json({
      message:"Old password is not correct",
      success:false,
    })
  }
  if(password!==confirmPassword){
    return res.status(403).json({
      message:"password are not matched",
      success:false
    })
  }

  const hashPassword = await bcrypt.hash(password,10);
  await User.findByIdAndUpdate(user._id, {password:hashPassword}
  )

  await mailSender(
    email,
    `<h2>Hello ${user.firstName || "User"}</h2>
     <p>Your password was changed successfully.</p>
     <p>If this wasn’t you, please contact support immediately.</p>`,
    "Password Changed Successfully"
  );

  return res.status(200).json({
    message:"change password succefyllly",
    success:true,
    user
  })


}
