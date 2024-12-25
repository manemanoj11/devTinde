const express=require('express')
const profileRouter=express.Router()
const { userAuth } = require("../middlewares/auth");
const { model } = require('mongoose');

profileRouter.get("/profile",userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log(user)
        res.send(user)
    } catch (err) {
        res.send(err.message)
    }
})

module.exports=profileRouter