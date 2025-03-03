const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const sendEmail=require('../utils/sendEmail')

// Send connection request
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id; // logged-in user id
        const toUserId = req.params.toUserId.trim();
        const status = req.params.status.trim();

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Request already exists" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        
        const emailRes = await sendEmail.run(
            "A new friend request from " + req.user.firstName,
            req.user.firstName + " is " + status + " in " + toUser.firstName
          );
          console.log(emailRes);

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUserId}`,
            data
        });
    } catch (e) {
        console.error("Error in send connection request:", e);
        res.status(400).json({ message: e.message });
    }
});

// Review connection request
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!" });
        }

        // Trim parameters
        const cleanedStatus = status.trim();
        const cleanedRequestId = requestId.trim();

        // Enhanced logging
        console.log("Status:", cleanedStatus);
        console.log("RequestId:", cleanedRequestId);
        console.log("LoggedInUser Id:", loggedInUser._id);

        const connectionRequest = await ConnectionRequest.findOne({
            _id: cleanedRequestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        console.log("Found Connection Request:", connectionRequest);

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        connectionRequest.status = cleanedStatus;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + cleanedStatus, data });
    } catch (err) {
        console.error("Error in review connection request:", err);
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;
                         