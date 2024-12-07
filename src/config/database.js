const mongoose=require("mongoose");
const mySecret ="mongodb+srv://Mane:Manemanoj11@namastenode.yojpf.mongodb.net/devTinder"
const connectDB = async () => {
    await mongoose.connect(mySecret);
    console.log("db connected")
}
module.exports=connectDB;

