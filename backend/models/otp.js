const mongoose= require("mongoose")
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

module.exports = mongoose.model("OTP",otpSchema)