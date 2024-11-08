const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
    type:String,
    required:true,
    max: 20,
    trim:true,
   },
   lastName:{
    type:String,
    required:true,
    max: 20,
    trim:true,
   },
    email:{
    type:String,
    required:true,
    trim:true,
   },
   password:{
    type:String,
    required:true,
   },
   language:{
    type:String,
    enum:["English","Hindi","Spanish","French","German"],
   },
   image:{
    type:String,
    trim:true,
   },
   token:{
    type:String,
    trim:true,
   },
   resetPassExprire:{
    type:Date,
   }
});

module.exports=mongoose.model("User",userSchema);