const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://namastedev:0N7AsgFLdPph5Ych@cluster0.f4nfu.mongodb.net/devTinder")
}

module.exports=connectDB
