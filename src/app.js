const express=require("express");

const app=express();

app.use("/hello",(req,res,next)=>{
    console.log("Handling the route user");
    res.send("1st Response")   
    next(); 
},(req,res)=>{console.log("Handling the route user2");
    res.send("2nd Response")

})

// app.get(/hello/,(req,res)=>{
//     res.send("I am hello wala GET")
// })

// app.get(/a/,(req,res)=>{
//     res.send("I am inside routes")
// })

// app.get("/user/:userId/:name/:password",(req,res)=>{
//     console.log(req.params);
    
//     res.send("I am user wala GET")
// })

// // app.post("/hello",(req,res)=>{
// //     res.send("I am hello wala POST")
// // })

// // app.use("/hello/ab",(req,res)=>{
// //     res.send("abrakadabra")
// // }) 


// // app.use("/hello",(req,res)=>{
// //     res.send("hello hello hello")
// // })

// // app.use("/test",(req,res)=>{
// //     res.send("test from server")
// // })
// // app.use("/",(req,res)=>{
// //     res.send("enpty server")
// // }) 

app.listen(7777,()=>{
    console.log("Server is sucessfully running on port 7777");
    
});