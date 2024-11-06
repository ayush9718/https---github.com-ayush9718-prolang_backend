const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    status:{
        type:String,
        trim:true,
        enum:["waiting","learning"],
    },
});

module.exports=mongoose.model("User",userSchema);