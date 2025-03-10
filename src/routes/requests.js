const express = require("express")

const requestRouter = express.Router();

const {userAuth} =require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequests");
const user = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // we are validating our API which should only work for ignored and interested
        const ALLOWED_STATUS = ["ignored", "interested" ];

        if(!ALLOWED_STATUS.includes(status)){
            return res.status(400).json({message: "Inavlid Status Type: " + status})
        }

        /* Now check whether there is an existing connection between FROM USER to TO USER 
            OR... TO USER to FROM USER*/
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId:fromUserId, toUserId:toUserId},{fromUserId:toUserId, toUserId:fromUserId}],
        })
        if(existingConnectionRequest){
            return res.status(400).json({message: "Connection is already existed"})
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        res.json({
            message : "Connection request sent successfully",
            data
        });
    }   

    catch(err){
        res.status(400).send("ERROR: "+err.message);
    } 

})

module.exports = requestRouter ; 