const express= require("express");

const authRouter= express.Router();

const validateSignUpData=require('../utils/validations')

const User=require("../models/user");

const bcrypt=require("bcrypt")

authRouter.post("/signup",async(req,res)=>{
    // console.log(req.body);
    try{
        validateSignUpData(req);
        const {firstName, lastName, emailId, password}=req.body;
        //Encrypt the password

        const passwordHash=await bcrypt.hash(password,10);
        console.log(passwordHash);
        

        const user=new User({firstName,
            lastName,
            emailId,
            password:passwordHash});
        await user.save();
        res.send("User data added successfully")
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
    
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password}=req.body;

        const user=await User.findOne({emailId:emailId});
        if(!user){
            console.log("failed");
            // here we are writing this clearCookie if a user is not registerd yet..
            // It will clear the cookie 
            res.clearCookie("token"); 
            throw new Error("User is not registered yet");
            
        }
        const isPasswordValid = await user.validatePassword(password);

        // const isPasswordValid= await bcrypt.compare(password,user.password);
        if(isPasswordValid){

            const token= await user.getJWT();
            // 1. Create a JWT token

            // const token=jwt.sign({_id:user._id},"DEV@Tinder$789",{expiresIn:'1d'}) //user ID with secret Key
            //Everytime I logs in a new cookie will get generated

            //2. Add the token to the cookie and send the response to the user

            res.cookie("token",token, {httpOnly:true},{expires:'1m'}); // Secre cookie (httpOnly)
            res.status(200).send("Login Successful");
            console.log("Done");
            
        }
        else{
            console.log("failed");
            res.clearCookie("token");
            throw new Error("Password is not correct");
        }
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

module.exports=authRouter;