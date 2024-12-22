const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")
const { validateSignUp } = require('./utils/validation')
const app = express()
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
    try {
        validateSignUp(req)
        const { firstName, lastName, emailId, age, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)
        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password: passwordHash
        });

        await user.save();
        res.send("User added successfully");
    } catch (err) {
        console.error("Error:", err.message);
        res.status(400).send("Error saving the user: " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("EamilId is not present")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {

            const token = await jwt.sign({ _id: user._id }, "mane")
            console.log(token)
            res.cookie('token', token)
            res.send("login Done")
        }
        else {
            throw new Error("password is not correct")
        }
    } catch (err) {
        res.status(404).send("ERROR" + err.message)
    }
})

app.get("/profile",userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log(user)
        res.send(user)
    } catch (err) {
        res.send(err.message)
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emaild;
    // try{
    //     const user=await User.findOne({emaild:userEmail})
    //     if(!user){
    // res.status(404).send("uesr not found")
    //     }else{
    //         console.log(user)
    //         res.send(user)
    //     }
    // }
    try {
        const users = await User.find({ emaild: userEmail });
        if (users.length === 0) {
            res.status(404).send("user data not found")
        } else {
            res.send(users)
        }
    }
    catch (err) {
        res.status(404).send("something went wrong")
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        console.log(users.length)
        res.send(users)
    } catch (err) {
        res.status(404).send("No user available")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete({ _id: userId })
        res.send("user deleted sucessfully")
    }
    catch (err) {
        res.status(404).send("user not found")
    }
})

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
        })
        console.log(user)
        res.send("user sucessfully updated")
    } catch (err) {
        res.status(400).send("SomeThing went wrong");
    }
})

connectDB()
    .then(() => {
        console.log("Database connection established")
        app.listen(7777, () => {
            console.log("server is running on port 7777");
        });
    })
    .catch((err) => {
        console.log("cannot connect to database", err)
    })

