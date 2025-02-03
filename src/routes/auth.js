const express =require('express')
const authRouter=express.Router()

const { validateSignUp } = require('../utils/validation')
const User = require("../models/user")
const bcrypt = require('bcrypt')

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUp(req)
        const { firstName, lastName, emailId, age, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
       // console.log(passwordHash)
        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password: passwordHash
        });

        const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User Added successfully!", data: savedUser });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(400).send("Error saving the user: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("EamilId is not present")
        }

        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {

            const token = await user.getJWT()
           // console.log(token)
            res.cookie('token', token)
            res.send(user)
        }
        else {
            throw new Error("password is not correct")
        }
    } catch (err) {
        res.status(404).send("ERROR" + err.message)
    }
})

authRouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("logout done")
})


module.exports=authRouter