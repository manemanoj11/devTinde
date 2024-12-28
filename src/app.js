const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()

const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


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

