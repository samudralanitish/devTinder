const express=require("express");
const connectDB=require("./config/database")
const app=express();
const User=require("./models/user")
app.use(express.json())
app.post("/signup",async (req,res)=>{
    const user=new User(req.body);
    try{

        await user.save();
        res.send("User data saved successfully")
    }
    catch(err){
        res.status(400).send("error saving the data..."+err.message)
    }
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
