const express=require("express");
const connectDB=require("./config/database")
const app=express();
const User=require("./models/user");
app.use(express.json()) //middleware to our app
app.post("/signup",async(req,res)=>{
    console.log(req.body);
    const user=new User(req.body);
    try{
        await user.save(req.body);
        res.send("User data added successfully")
    }
    catch(err){
        res.status(400).send("Error saving the user:"+err.message)
    }
    
});

app.get("/feed",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user=await User.find({emailId:userEmail});
        if(user.length===0){
            res.send(404).status("user not found");
        }else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

app.get("/allfeed",async (req,res)=>{
    // const userEmail=req.body.emailId;
    try{
        const user=await User.find({});
        if(user.length===0){
            res.send(404).status("user not found");
        }else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

app.delete("/del",async(req,res)=>{
    const id=req.body.userId;
    console.log(id);
    
    try{
        const user=await User.findByIdAndDelete({_id:id})
        // const user=await User.findByIdAndDelete(id);
        res.send("user deleted successfully")
        
    }
    catch(err){
        res.status(400).send("something went wrong")
    }
})

app.patch("/upd/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try{
        // ee two lines are only for upadating the particular details only
        const ALLOWED_UPDATES=["age","gender","password","photoUrl","about","skills"]
        const isUpdateAllowed=Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        )
        if(data?.skills.length>10){
            throw new Error("Skills cannot be mor than 10");
        }
        if(!isUpdateAllowed){
            throw new Error("Update Not Allowed");
        }
         await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
         });
        res.send("user updated successfully");
    }
    catch(err){
        res.status(400).send("update falied: "+err.message)
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
