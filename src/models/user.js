const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')
const bcrypt =require('bcrypt')

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


userSchema.methods.getJWT= async function () {
    const user=this
    const token= await jwt.sign({_id:user._id},"mane")
return token
}


userSchema.methods.validatePassword= async function(passwordInputByUser){
    const user=this
    const passwordHash=user.password
    const isPasswordValid= await bcrypt.compare(passwordInputByUser,passwordHash)

return isPasswordValid
}
const UserModel = mongoose.model("User",userSchema)

module.exports=UserModel