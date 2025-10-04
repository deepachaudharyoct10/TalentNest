const express= require("express");
const app= express();
require("dotenv").config();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const {connectDb}= require("./config/database")

const PORT= process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);

})



connectDb();