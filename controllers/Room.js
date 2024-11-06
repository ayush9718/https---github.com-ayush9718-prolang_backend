const User = require("../model/user");

exports.getRandRoom= async(req,res)=>{
    try{
        
        const randroom= await User.aggregate([
            { $match: { status: "waiting" } },      
            { $sample: { size: 1 } }             
          ]);

          if (randroom.length > 0) {
            const rID = randroom[0]._id; 
            const updatedRoom = await User.findByIdAndUpdate(
                rID,
                { status: "learning" 
                },{new:true});
            res.status(200).json({
                updatedRoom,
            })
          }
          else{
            res.status(400).json({
                room:{_id:"-1"},
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
       
        const room = await User.create({
            status:"waiting",
        });
        if(!room){
            res.status(404).json({
                message:"room not created",
                room,
            });
        }
        res.status(200).json({
            room,
            message:"room is created"
         });
    }
    catch(err){
        console.log("error while creating room");
        console.error(err);

    }
}