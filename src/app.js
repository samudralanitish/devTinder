const express=require("express");
const connectDB=require("./config/database")
const app=express();
const User=require("./models/user")
app.use(express.json()) //middleware
app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const users= await User.findOne({emailId:userEmail});
        if(users.length===0){
            res.status(400).send("user data not found")
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(404).send("Error not found")
    }
})
app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find();
        res.send(users)
    }
    catch{
        res.status(400).status("unauthorized data")
    }
})

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
