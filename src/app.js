const express=require("express");

const app=express();

app.use("/test",(req,res)=>{
    res.send("test from server")
})
app.use("/",(req,res)=>{
    res.send("enpty server")
})
app.listen(3000,()=>{
    console.log("Server is sucessfully running on port 3000");
    
});