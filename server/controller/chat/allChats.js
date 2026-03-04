
const collabModel = require("../../models/collabModel");
const messageModel = require("../../models/messageModel");
const { userProfileModel } = require("../../models/profileModel");

const allChat = async(req,res)=>{
    try {
        const userId = req.userId;

        if(!userId){
            return res.status(400).json({success : false, message : "Id not available"})
        }
        const myProfile = await userProfileModel.findOne({userId});
        const sender = await messageModel.find({senderId : myProfile._id}).populate("receiverId");
        const receiver = await messageModel.find({receiverId : myProfile._id}).populate("senderId");
        res.status(200).json({success : true, message : "chat friend", receiver, sender});
    } catch (error) {
        return res.status(500).json({success : false, message : error.message});
    }
}
module.exports = allChat;