const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()
const cors= require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require('./routes/user')

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

app.get("/user", async (req, res) => {
    const userEmail = req.body.emaild;
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

// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({})
//         console.log(users.length)
//         res.send(users)
//     } catch (err) {
//         res.status(404).send("No user available")
//     }
// })

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

