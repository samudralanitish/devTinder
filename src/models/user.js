const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

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
userSchema.methods.getJWT =async function(){  //here we can write any function name getJWT or any name
    const user=this;

    const token=await jwt.sign({_id:user._id},"DEV@Tinder$789",{expiresIn:'1d'});
    return token;
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user = this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

module.exports=mongoose.model("User",userSchema);