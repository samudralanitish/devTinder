const express=require("express");
const connectDB=require("./config/database")
const app=express();
const User=require("./models/user");
const bcrypt=require("bcrypt")
const validateSignUpData=require('./utils/validations')
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");

const {userAuth} =require("./middlewares/auth")

app.use(express.json()) //middleware to our app
app.use(cookieParser()); // middleware foor cookies
app.post("/signup",async(req,res)=>{
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

app.post("/login",async(req,res)=>{
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

app.get("/profile", userAuth, async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error "+err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async(req,res)=>{

    const user= req.user;

    res.send(user.firstName+" "+ user.lastName+" sent the connection request");
})

// app.get("/profile",userAuth async(req,res)=>{
//     try{
//         const cookies=req.cookies;
//         const {token}=cookies;
//         if(!token){
//             throw new Error("Invalid Token");
//         }

//         const decodedMsg = await jwt.verify(token,"DEV@Tinder$789")
//         console.log(decodedMsg);

//         const {_id}=decodedMsg;

//         console.log("Logged in user is: "+ _id);
//         // res.send("Read Cookies");

//         const user= await User.findById(_id);
//         if(!user){
//             throw new Error("User doesn't exist");
//         }

//         res.send(user);
//     }
//     catch(err){
//         res.status(400).send("Error: "+err.message);
//     }
    
// })

// app.get("/feed",async (req,res)=>{
//     const userEmail=req.body.emailId;
//     try{
//         const user=await User.find({emailId:userEmail});
//         if(user.length===0){
//             res.send(404).status("user not found");
//         }else{
//             res.send(user);
//         }
//     }
//     catch(err){
//         res.status(400).send("something went wrong");
//     }
// })

// app.get("/allfeed",async (req,res)=>{
//     // const userEmail=req.body.emailId;
//     try{
//         const user=await User.find({});
//         if(user.length===0){
//             res.send(404).status("user not found");
//         }else{
//             res.send(user);
//         }
//     }
//     catch(err){
//         res.status(400).send("something went wrong");
//     }
// })

// app.delete("/del",async(req,res)=>{
//     const id=req.body.userId;
//     console.log(id);
    
//     try{
//         const user=await User.findByIdAndDelete({_id:id})
//         // const user=await User.findByIdAndDelete(id);
//         res.send("user deleted successfully")
        
//     }
//     catch(err){
//         res.status(400).send("something went wrong")
//     }
// })

// app.patch("/upd/:userId",async(req,res)=>{
//     const userId=req.params?.userId;
//     const data=req.body;
//     try{
//         // ee two lines are only for upadating the particular details only
//         const ALLOWED_UPDATES=["firstName","lastName","age","gender","password","photoUrl","about","skills"]
//         const isUpdateAllowed=Object.keys(data).every((k)=>
//             ALLOWED_UPDATES.includes(k)
//         )
//         // if(Object.keys(isUpdateAllowed).length==0){
//         //     return res.status(400).send("No valid fields to update.")
//         // }
//         // const isSameData=Object.keys(isUpdateAllowed).every(
//         //     (key)=>JSON.stringify(userId[key]==JSON.stringify(isUpdateAllowed[key]))
//         // );
//         // if(isSameData){
//         //     return res.status(200).send("Data is already updated");
//         // }
//         if(data?.skills.length>10){
//             throw new Error("Skills cannot be more than 10");
//         }
//         if(!isUpdateAllowed){
//             throw new Error("Update Not Allowed");
//         }
//          await User.findByIdAndUpdate({_id:userId},data,{
//             returnDocument:"after",
//             runValidators:true,
//          });
//         res.send("user updated successfully");
//     }
//     catch(err){
//         res.status(400).send("update failed: "+err.message)
//     }
// })

connectDB()
.then(()=>{
    console.log("DB Connection Established...");
    app.listen(7777,()=>{
        console.log("Server is sucessfully running on port 7777");   
    });
})

.catch((err)=>{
    console.log("Database cannot be connected");
});
