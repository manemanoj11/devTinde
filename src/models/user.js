const mongoose=require('mongoose');

 const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
    },
    age:{
        type:Number
    },
     password:{
        type:String,
        minlength: [8, "Password must be at least 8 characters long"],
    }
 })
const UserModel = mongoose.model("User",userSchema)

module.exports=UserModel