const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
mongoose.connect(process.env.MONGO_URL,)
.then(()=>console.log("db connection succesfull"))
.catch((err)=>{
    console.log("db connection error occur");
    console.error(err); 
})
} 