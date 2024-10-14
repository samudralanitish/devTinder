const adminAuth = (req,res,next)=>{
    console.log("Admin auth checked");
    const token="xyz";
    const isAdminAuthorized= token==="xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
    
}

const userAuth=(req,res,next)=>{
    console.log("user Auth is checked");
    const token="xyz";
    const isuserAuthorized=token==="xyz";
    if(!isuserAuthorized){
        res.status(401).send("Unauthorized data");
    }
    else{
        next();
    }
    
}

module.exports=(
    {adminAuth,userAuth}
)