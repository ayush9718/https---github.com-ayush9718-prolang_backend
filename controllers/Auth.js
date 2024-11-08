const User = require("../model/user");
const bcrypt =require("bcrypt");
const OTP = require("../model/OTP");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const passwordUpdated  = require("../mail/tempalte/passwordUpdate");

require("dotenv").config();



exports.signUp=async (req,res)=>{
    try {
		const {firstName, lastName,email,password,
			language, otp
		} = req.body;
		if ( !firstName || !email ||!password || !lastName || !language || !otp ) {
			return res.status(403).json({
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

		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		const hashpass = await bcrypt.hash(password, 10);
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashpass,
			image: `https://robohash.org/${firstName} ${lastName}`,
		});
		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} 
	catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};

exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;
		const checkUserPresent = await User.findOne({ email });
		if (checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}
		var otp = otpGenerator.generate(6, {
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);

		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
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
        const payload = {email:entry.email,_id:entry._id};
        if(await bcrypt.compare(password,entry.password)){
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
                entry,
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


exports.changePassword= async (req,res)=>{
	try{
		const userdata = await User.findbyId(req.user.id);

		const{oldPassword, newPassword, confirmPassword} = req.body;

		if(!oldPassword || !newPassword || !confirmPassword){
			return res.status(401).json({
				success:false,
				message:"all field required",
			})
		}
		const ispassword = bcrypt.compare(oldPassword,userdata.password);
		if(!ispassword){
			return res.status(402).json({
				success:false,
				messgae:"old password is not matching"
			})
		}

		if(oldPassword === newPassword){
			return res.status(401).json({
				success:false,
				messgae:"new passwrod should be different from old password"
			})
		}
		if (newPassword!== confirmPassword){
			return res.status(401).json({
				success:false,
				message:"password not matching to the confirm password",
			});
		}
		const bcryptpass = await bcrypt.hash(newPassword, 10);
		const updatedPassUser = await User.findByIdAndUpdate(
			req.user.id,
			{ password: bcryptpass },
			{ new: true }
		);
		try {
			const emailResponse = await mailSender(
				updatedPassUser.email,
				"Study Notion - Password Updated",
				passwordUpdated(
					updatedPassUser.email,
					`${updatedPassUser.firstName} ${updatedPassUser.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} 
		catch (error) {
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}
	}
	catch(err){
		console.log("error occuring while changing password");
		console.error(err);
	}

}
