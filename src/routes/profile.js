const express=require('express')

const profileRouter=express.Router();

const {userAuth} =require("../middlewares/auth")

const {validateEditProfileData}=require("../utils/validations")

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error "+err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            // or else we can return... like... return res.status(400).send("Error");
            throw new Error ("Invalid edit request..!");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
        await loggedInUser.save();
        

        res.json({
            message:`${loggedInUser.firstName} your profile was updated successfully`,
            data:loggedInUser
        });
        

        
    }
    catch(err){
        res.status(400).send("ERROR "+err.message)
    }
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
    const loggedInUser = req.user;
    
})

module.exports = profileRouter;