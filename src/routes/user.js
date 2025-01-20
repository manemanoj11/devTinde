const express = require('express')
const userRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            "firstName lastName age"
        );
        // }).populate("fromUserId", ["firstName", "lastName"]);
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        req.statusCode(400).send("ERROR: " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {

    try {
        const logginedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: logginedInUser._id, status: "accepted" },
                { fromUserId: logginedInUser._id, status: "accepted" },
            ],

        }).populate(
            "fromUserId",
            "firstName lastName age"
        ).populate(
            "toUserId",
            "firstName lastName age"
        )
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()==logginedInUser._id.toString())   {
                return row.toUserId
            }
            return row.fromUserId 
        })
        res.json({ message: "Data fetched successfully", data: data })

    }
    catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})
module.exports = userRouter