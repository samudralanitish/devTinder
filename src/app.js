const express=require("express");
const connectDB=require("./config/database")
const app=express();
const User=require("./models/user")
app.post("/signup",async (req,res)=>{
    
    const user=new User({
        firstName:"Vinayaka",
        lastName:"Shiva",
        emailId:"vinayaka@shiva.com",
        password:"vinayaka@123"
    });
    await user.save();
    res.send("User data saved successfully")
});

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
