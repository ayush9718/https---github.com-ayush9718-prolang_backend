const User = require("../model/user");
const imageUploader = require("../utility/imageUploader");

exports.ProfileImageUpdater = async (req,res) =>{
    try {

		 const id = req.user._id;
         const image = req.files.pfp;

	const user = await User.findById(id);

	if (!user){
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await imageUploader(
		image,
		process.env.FOLDER_NAME,
	);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });

	} catch (err) {
		return res.status(500).json({
            success: false,
            error: err.message,
            messgae:"error while upddating profile pic"
        });	
	}
}

exports.ProfileUpdater = async (req,res) =>{

    try {
		const {firstName,lastName,language,} = req.body;
		const id = req.user.id;

		const userDetails = await User.findById(id);

        userDetails.firstName = firstName || userDetails.firstName;
		userDetails.lastName = lastName || userDetails.lastName;
		userDetails.language = language || userDetails.language;

		const updatedProfile = await userDetails.save();

		return res.json({
			success: true,
			updatedProfile,
			message: "Profile updated successfully",
		});
	} catch (err) {
		console.log(error);
		return res.status(500).json({
			success: false,
            message:"error occur while updating profile",
			error: err.message,
		});
	}
};

exprots.deleteAccout = async (req,res) =>{
    try {
		const id = req.user._id;
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}        
		const deleted =await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
             success: false, 
             message: "User Cannot be deleted successfully",
             error:err.message });
	}
};


exprots.getAllDetailes = async (req,res) =>{
    try {
		const id = req.user._id;
		const userDetails = await User.findById(id);
        userDetails.password=undefined;
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
            message: "error while fetching user data",
			error: err.message,
		});
	}

}

