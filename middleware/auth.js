const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/user");

exports.auth = async (req, res, next) => {
    try{
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode= ",decode);
            req.user = decode;
        }
        catch(err) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}