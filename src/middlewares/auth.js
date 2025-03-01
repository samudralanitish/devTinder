const jwt=require("jsonwebtoken");

const User=require("../models/user")

const userAuth=async (req,res,next)=>{

try {
    //Read the Token from req.cookies
    const cookies=req.cookies

    //finding the token from cookies
    const {token}=cookies;
    if(!token){
        throw new Error ("Token is not valid!!!!");
    }

    //Validate the token
    const decodedObj= await jwt.verify(token, "DEV@Tinder$789");

    //now get the Id
    const {_id}=decodedObj;

    //Find user inside database
    const user= await User.findById(_id);
    req.user=user;
    if(!user){
        throw new Error("User not found");
    }
    next();
}

    catch(err){
        res.status(400).send("ERROR "+err.message)
    }



    
}

module.exports=(
    {userAuth}
)