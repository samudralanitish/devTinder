const express=require("express");

const app=express();

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Lol Error aagaya")
    }
})

app.get("/admin",(req,res)=>{
    //try{
        throw new Error("some random error");
    //}
    // catch{
    //     res.status(500).send("Something happend, please try to contact support team")
    // }
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Lol Error aagaya")
    }
})

//this is the last priority to solve errors.



app.listen(7777,()=>{
    console.log("Server is sucessfully running on port 7777");
    
});