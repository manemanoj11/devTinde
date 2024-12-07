const express=require("express");
const connectDB= require("./config/database")
const app=express()
const User=require("./models/user")


app.use(express.json());

app.post("/signup",async (req,res)=>{

    console.log(req.body)
    // const userObj={
    //     fisrtName:"mane",
    //     lastName:"manoj",
    //     emailId:"ajdfadf@gmail.com",
    //     password:"1234563"
    // }
    //const user=new User(userObj)

    //else u can write as 

    const user=new User(req.body)
    try{
        await user.save()
        //all of this return a promise
        res.send("user add sucessfully")
    }
    catch(err){
        res.status(400).send("Error saving the user :"+ err.message)
    }
 
})


app.get("/user",async (req,res)=>{
    const userEmail=req.body.emaild;
// try{
//     const user=await User.findOne({emaild:userEmail})
//     if(!user){
// res.status(404).send("uesr not found")
//     }else{
//         console.log(user)
//         res.send(user)
//     }
// }
    try{
        const users= await User.find({emaild:userEmail});
        if(users.length===0){
            res.status(404).send("user data not found")
        }else{
            res.send(users)
        }
    }
    catch(err){
    res.status(404).send("something went wrong")
    }
})

app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({})
        console.log(users.length)
        res.send(users)
    }catch(err){
    res.status(404).send("No user available")
    }
})

app.delete("/user",async (req,res)=>{
    const userId=req.body.userId
    try{
        const user =await User.findByIdAndDelete({_id:userId})
        res.send("user deleted sucessfully")
    }
    catch(err){
res.status(404).send("user not found")
    }
})

app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        const user=await User.findByIdAndUpdate({_id:userId},data,{
           returnDocument:"after",  
        })
        console.log(user)
        res.send("user sucessfully updated")
     }catch(err){
      res.status(400).send("SomeThing went wrong");
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

