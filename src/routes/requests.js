const express = require("express")

const requestRouter = express.Router();

const {userAuth} =require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user")

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

        /* Check whether toUserId is existed in the DB, why because if you send any random
            toUserId this API will take, so to avoid this we have DB level Check*/
        const toUser = await User.findById(toUserId);
        //console.log(toUser); mottham user antha diguthundi
        if(!toUser){
            return res.status(400).json({message: "User Not Found"});
        }


        // Check if FROM USER === TO USER
        if(fromUserId.equals(toUserId)){
            return res.status(400).json({message : "You can't send connection to yourself"})
        }


        /* Now check whether there is an existing connection between FROM USER to TO USER 
            OR... TO USER to FROM USER*/
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId:fromUserId, toUserId:toUserId},{fromUserId:toUserId, toUserId:fromUserId}],
            // $or: [{fromUserId,toUserId},{toUserId,fromUserId}] -> Doubt in this line
        })
        if(existingConnectionRequest){
            return res.status(400).json({message: "Connection is already existed"})
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        // if(status == "ignored"){
        //     res.json({
        //         message : "Connection ignored successfully",
        //         data
        //     });
        // }

        res.json({
            message : `${req.user.firstName + " "+ status + " "  + toUser.firstName + " " + "profile"} `,
            data
        });
    }   

    catch(err){
        res.status(400).send("ERROR: "+err.message);
    } 

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user;  
        const {status, requestId} = req.params;

        const ALLOWED_STATUS = ["accepted", "rejected"];
        if(!ALLOWED_STATUS.includes(status)){
            return res.status(400).json({message: "Status not found"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if(!connectionRequest){
            return res.status(404).json({message: "Connection Request Not Found"});
        }
        connectionRequest.status= status;

        const data = await connectionRequest.save();

        res.status(200).json({message: "Connection Request "+ status + " Susscessfully", data});
    }

    catch (err){
        res.status(400).send("ERROR! "+err.message);
    }

})

module.exports = requestRouter ; 