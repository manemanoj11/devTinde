const jwt=require('jsonwebtoken')
const User=require('../models/user')

const userAuth=async (req,res,next)=>{
 try{ 
    const {token}=req.cookies
  if(!token){
    throw new Error("token is not valid")
  }
  const decodeObj=await jwt.verify(token,"mane")
  const {_id}=decodeObj
  const user=await User.findById(_id)
  if(!user){
    throw new Error("User not found")
  }
  req.user=user
  next()
}
catch(err){
    throw new Error("Error :"+ err.message)
}
}


module.exports={
    userAuth
}