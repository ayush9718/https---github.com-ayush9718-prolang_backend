const express = require("express");
const app = express();
const dbconnect  = require("./config/dbconnection");
const rooms = require("./routes/rooms");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,        
    tempFileDir: '/tmp/',
}));

app.use("/prolang/",rooms);


dbconnect.connect();

const Port = process.env.PORT;
app.listen(Port,()=>{
    console.log("App is running at the ",Port);
})