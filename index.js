const express = require("express");
const app = express();
const dbconnect  = require("./config/dbconnection");
const rooms = require("./routes/rooms");

require("dotenv").config();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/prolang/",rooms);

dbconnect.connect();

const Port = process.env.PORT;
app.listen(Port,()=>{
    console.log("App is running at the ",Port);
})