const User = require("../model/user");
const bcrypt =require("bcrypt");
require("dotenv").config();


exports.signUp=async (req,res)=>{
    try {
		const {name,email,password} = req.body;
		if (
			!name || !email ||!password
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exisit",
			});
		}
		const hashpass = await bcrypt.hash(password, 10);
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			image: `https://robohash.org/${name}`,
		});
		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};

exports.login=async (req,res) =>{
    try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "email or password not entered",
			});
		}

		const entry = await User.findOne({ email });

		if (!entry) {
			return res.status(401).json({
				success: false,
				message: `no registration with this email id`,
			});
		}
        const payload = {email:entry.email,id:entry._id};
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expires:"2h"
            });
            entry.token=token;
            entry.password=undefined;
            
            res.cookie("token",token,{
                expires: new Date(Date.now()+ 5*24*60*60*1000),
                httpOnly:true
            }).status(200).json({
                success:true,
                token,
                user,
                message:"user login success"
            })
		} 
        else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message:"error in login",
		});
	}
};

