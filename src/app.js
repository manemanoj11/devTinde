const express=require("express");
const connectDB= require("./config/database")
const app=express()
const User=require("./models/user")

app.post("/signup",async (req,res)=>{
    // const userObj={
    //     fisrtName:"mane",
    //     lastName:"manoj",
    //     emailId:"ajdfadf@gmail.com",
    //     password:"1234563"
    // }
    //const user=new User(userObj)
    //else u can write as 

    const user=new User({
        firstName:"//",
        lastName:"manoj",
        emaild:"ajdfadf@gmail.com",
        age:"1234563" 
    })
    try{
        await user.save()
        //all of this return a promise
        res.send("user add sucessfully")
    }
    catch(err){
        res.status(400).send("Error saving the user :"+ err.message)
    }
 
})




 
connectDB() 
.then(()=>{
    console.log("Database connection established")
    app.listen(7777,() => {
        console.log("server is running on port 7777");
    });
})  
.catch((err)=>{
console.log("cannot connect to database",err)
})

