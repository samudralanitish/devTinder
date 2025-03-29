const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "skills", "age", "gender"];

// need to get who are interested in my profile
userRouter.get("/user/request/received", userAuth, async(req,res)=>{

    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.status(200).json({message: "The following users are interested in " + loggedInUser.firstName + " profile",
            data : connectionRequest
        })
    }
    catch(err){
        res.status(400).send("ERROR! "+err.message);
    }

})

// need to get the data of my connections which means I accepted users only
userRouter.get("/user/connections", userAuth, async(req,res)=>{

    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[{toUserId : loggedInUser._id, status: "accepted"},
                {fromUserId : loggedInUser._id, status: "accepted"}]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
        console.log(connectionRequest);
        
        const data = connectionRequest.map((row)=>{
                if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
                    return row.toUserId;
                }
                return row.fromUserId;
            }      
        )
        res.status(200).json({data});
    }

    catch(err){
        res.status(400).send("ERROR! "+err.message);
    }

})

userRouter.get("/feed", userAuth, async(req,res)=>{

    try{

        const loggedInUser = req.user;

        //finding the connection request, whether I had (send or received)
        const connectionRequest = await ConnectionRequest.find({

            // here from means I sent the req... to means I got the req
            $or:[{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId")
        // .populate("fromUserId","firstName").populate("toUserId","firstName")

        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const user = await User.find({
            $and: [{_id: {$nin: Array.from(hideUsersFromFeed)}}, {_id: {$ne: loggedInUser._id}}]
        }).select(USER_SAFE_DATA)

        console.log(user);
        
        res.send(user)
        


    }
    catch(err){
        res.status(400).send("ERROR! "+ err.message);
    }
})

module.exports = userRouter;