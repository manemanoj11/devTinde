 const mongoose=require('mongoose');

 const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String
    },
    emaild:{
        type:String,
        required: true,
        unique: true,
    },
    age:{
        type:Number
    }
 })
const UserModel = mongoose.model("User",userSchema)

module.exports=UserModel