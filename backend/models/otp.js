const mongoose= require("mongoose");
const mailSender = require("../utils/mailSender");
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        requierd:true,
    },
    otpValue:{
        type:String,
        requried:true,

    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})


async function sendVerification(email,otp){
    try{
        const mailResponse = await mailSender(email,"Otp verification from TalentNest",otp);
        console.log("mailResponse ", mailResponse)
    }catch(error){
        console.log("error at the time of otp send",error);
    }
}

otpSchema.pre("save",async function(next){
    await sendVerification(this.email,this.otp);
    console.log("otp has send")
    next();
})
module.exports = mongoose.model("OTP",otpSchema)