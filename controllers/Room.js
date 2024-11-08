const User = require("../model/user");
const Status = requiere("../model/status");

exports.getRandRoom= async(req,res)=>{
    try{

        const {email}= req.user;
        const userDetail= await User.findOne({email:email});
        const randroom= await Status.aggregate([
            { $match: { status: "waiting", language:userDetail.language }},      
            { $sample: { size: 1 } }             
          ]);

          if (randroom.length >0) {

            const rID = randroom[0]._id; 
            const updatedRoom = await Status.findByIdAndUpdate(
                rID,
                { status: "learning" ,
                    email_getter:email,
                },{new:true});
            res.status(200).json({
                success:true,
                updatedRoom,
                message:"getting random room successfull",
            })

          }
          else{
            res.status(400).json({
                success:false,
                randroom:{},
                message:"dont have any waiting room right now"
            });}
    }
    catch(err){
        console.log("problem in fetching random room");
        console.error(err);
    }
}

exports.createRoom = async (req,res)=>{
    try{
        const {email} = req.user;
        const userDetail = await User.findOne({email:email})
        const room = await Status.create({
            status:"waiting",
            email_creator: email,
            language:userDetail.language,
        });

        if(!room){
            res.status(404).json({
                success:false,
                room,
                message:"room not created",
            });
        }

        res.status(200).json({
            success:true,
            room,
            message:"room is created"
         });
    }
    catch(err){
        console.log("error while creating room");
        console.error(err);

    }
}