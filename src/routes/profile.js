const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log(user)
        res.send(user)
    } catch (err) {
        res.send(err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request")
        }
            const loggedInUser=req.user;
            Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
            await loggedInUser.save()
            res.json({
                message: `${loggedInUser.firstName}, your profile updated successfully`,
                data: loggedInUser,
              });
        }
     catch (err) {
        res.send(err.message)
    }
})

module.exports = profileRouter