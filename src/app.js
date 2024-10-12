const express=require("express");

const app=express();

app.get("/hello",(req,res)=>{
    res.send("I am hello wala GET")
})

app.post("/hello",(req,res)=>{
    res.send("I am hello wala POST")
})

app.use("/hello/ab",(req,res)=>{
    res.send("abrakadabra")
}) 


app.use("/hello",(req,res)=>{
    res.send("hello hello hello")
})

app.use("/test",(req,res)=>{
    res.send("test from server")
})
app.use("/",(req,res)=>{
    res.send("enpty server")
}) 

app.listen(3000,()=>{
    console.log("Server is sucessfully running on port 3000");
    
});