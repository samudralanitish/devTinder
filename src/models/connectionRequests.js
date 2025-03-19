const mongoose =require('mongoose');


const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["interested", "ignored", "accepted", "rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true,
});

// We can check in schema level also whether fromUserID is === to toUserId

connectionRequestSchema.pre("save",function (){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error( "You Can't send request to yourself")
    }
})

const ConnectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel;