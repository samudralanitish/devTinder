const mongoose=require("mongoose");
const validator=require("validator");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address: "+ value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not Strong: "+value)
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdummy-profile&psig=AOvVaw2PTu2Jo-2j9DuU2JTFtp2F&ust=1740392165076000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMi6uZrI2YsDFQAAAAAdAAAAABAJ",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid:" + value);
            }
        }
    },
    about:{
        type:String,
        default:"This is a default info of user!"
    },
    skills:{
        type:[String]
    },
},
{
    timestamps:true
})

module.exports=mongoose.model("User",userSchema);