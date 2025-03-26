import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";

import {v2 as cloudinary} from "cloudinary";
import cors from "cors";



//const express =  require("express");
const app = express();
//const port = 3000;
dotenv.config();
const port = process.env.PORT;
const MONGO_URL=process.env.MONGO_URI;
//console.log(MONGO_URL);

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    //origin:process.env.FRONTEND_URL,
   // origin:"http://localhost:5173",
   origin:"https://blog-app-modified.vercel.app/",
  // origin:"*",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// app.options("*", cors({
//     origin: "https://blog-app-modified.vercel.app",
//     credentials: false,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }));



app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})
);

//DB code
try{
    mongoose.connect(MONGO_URL);
    console.log("connected to mongo-db");
} catch(error){
    console.log(error);
}

//defining routes
app.use("/api/users",userRoute);
app.use("/api/blogs",blogRoute);

//cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET_KEY, 
});


app.listen(port,()=>{
    console.log(`Example app listening on ${port}`);
})