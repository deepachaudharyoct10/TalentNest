const nodemailer = require("nodemailer")

const mailSender = async (email , body  , title)=>{
try{
 const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    })

    const info = await transporter.sendMail({
        from:`TalentNest`,
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
    })

    console.log("info are ",info)
    return info
}catch(error){
console.log("error is",error);
console.log("error in pre middlareware")
}
   
}

module.exports= mailSender