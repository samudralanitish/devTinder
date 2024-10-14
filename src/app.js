const express=require("express");

const app=express();

const {adminAuth,userAuth}=require("./middlewares/auth.js")

app.use("/admin",adminAuth)
// app.use("/user",userAuth)

app.get("/admin/getAdmin",(req,res)=>{
    res.send("Getting Admins Data") 
})

app.get("/user/login",(req,res)=>{
    res.send("Getting user Data") 
})

app.get("/user/insideDashboard",userAuth,(req,res)=>{
    res.send("User is in inside dashboard") 
})

app.listen(7777,()=>{
    console.log("Server is sucessfully running on port 7777");
    
});