const Course = require("../models/course")
const Tag= require("../models/tag")
const User = require("../models/user")
const uploadImageToCloudinary = require("../utils/imageUploader")
// create course 
// fetch course

exports.createCourse = async(req , res)=>{
    try{

        const {courseName, courseDescription,whatYouWillLearn, price, tag}= req.body;
        const thumbnail = req.files.thumbnailImage;
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
            return res.status(400).json({
                message:"all fields are required",
                success:false
            })
        }

        const userId= req.user.id;
        const instructorId= await User.findById(userId);
        console.log("insertcior id ",instructorId)

        if(!instructorId){
            return res.status(404).json({
                message:"instructor is not found",
                success:false
            })
        }

        const tagDetails = await Tag.findById(tag)

        if(!tagDetails){
            return res.status(403).json({
                messgae:"tag not found",
                success:false
            })
        }


        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
        const  newCourse = await Course.create({courseName, 
            courseDescription,
            instructor:instructorId._id,
            tags:tagDetails._id,
            price,
            whatYouWillLearn,
            thumbnail:thumbnailImage.secure_url
            
            
        })

        await User.findByIdAndUpdate({_id:instructorId._id},{$push:{
            courses:newCourse._id,
        }},{new:true} )

        await Tag.findByIdAndUpdate({_id:tagDetails._id},{$push:{
            course:newCourse._id
        }},{new:true})

        return res.status(200).json({
            message:"course is created successfully",
            success:true,
            Data:newCourse
        })
    }catch(error){
        return res.status(500).json({
            message:"error at the time of course creaeion",
            success:false,
        })
    }
}


//get all courses 

exports.showAllCourses = async(req ,res)=>{
    try{

        const allCourses= await Course.find({},{
            courseName:true,
            price:true,
            tags:true,
            instructor:true,
            thumbnail:true,
            ratingAndReviews:true,
            studentEnrolled:true,

        }).populate("instructor").exec();
        if(allCourses.length===0){
            return res.status(400).json({
                message:"no courses found",
                success:false
            })
        }

        return res.status(200).json({
            message:"all course are fetch",
            success:true,
            data:allCourses
        })
    }catch(error){
        return res.status(500).json({
            message:"no data found",
            error:error,
            success:false
        })
    }
}