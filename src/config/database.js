const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://Namaskaramdev:wE9nwTfNXUl5IuZO@namaskaramnode.3ghfw.mongodb.net/devTinder")
}

module.exports=connectDB
