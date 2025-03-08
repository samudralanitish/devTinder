const validator=require('validator');
const User=require("../models/user");

const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Not valid Email!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is nor strong");
    }
};

const validateEditProfileData=(req)=>{
    const userId=req.user;
   const ALLOWED_EDITS=["firstName","lastName","age","gender","photoUrl","about","skills"];

   /*Here object.keys allows us what are the keys(age, gender..etc) present in this
   And .every(field=>ALLOWED_EDITS.includes(field)) checks whether each and every field 
   which comes from req.body is present in our ALLOWED_EDITS or not -> returns boolean value*/

   const isEditAllowed= Object.keys(req.body).every(field=>ALLOWED_EDITS.includes(field));
   if(Object.keys(isEditAllowed).length==0){
        return "No valid fields to Update"
   }
   const isSameData = Object.keys(isEditAllowed).every(
    (key)=>JSON.stringify(userId[key]==JSON.stringify(isEditAllowed[key])))
    if(isSameData){
        return res.status(200).send("Data is already updated");
    }
   return isEditAllowed   

}

module.exports={validateSignUpData, validateEditProfileData};