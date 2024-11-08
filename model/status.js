const mongoose= require("mongoose");

exports.statusSchema=mongoose.Schema({
    email_creater:{
        type:String,
        trim:true,
    },
    email_getter:{
        type:String,
        trim:true,
    },
    language:{
        type:String,
        enum:["English","Hindi","Spanish","French","German"],
    },
    status:{
        type:String,
        enum:["Waiting","Learning"],
        required: true,
    },
    createdAt: {
		type: Date,
		default: Date.now,
		expires: 20*60,}
});

module.exports = mongoose.model("Status",statusSchema);