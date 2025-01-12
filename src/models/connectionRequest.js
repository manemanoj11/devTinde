const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepeted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps: true
    })

    connectionRequestSchema.pre("save", function(next){
        const connectionRequest =this
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error("User cannot send request to himself")
        }
        next()
    })


const connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports= connectionRequestModel