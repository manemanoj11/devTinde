const mongoose=require("mongoose");
//const mySecret =process.env.DB_CONNECTION_SECRET
const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("db connected")
}
module.exports=connectDB;

