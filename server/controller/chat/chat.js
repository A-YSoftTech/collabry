
const collabModel = require("../../models/collabModel");

const chat = async(req,res)=>{
    try {
        const id = req.userId;

        if(!id){
            return res.status(400).json({success : false, message : "Id not available"})
        }
        const sendByOwner = await collabModel.find({ownerId : id, status : "friend"}).populate("userProfileId", "profilePhoto username isOnline updatedAt");
        const receiveByOwner = await collabModel.find({status : "friend", userId : id}).populate("ownerProfileId", "profilePhoto username isOnline updatedAt");
        res.status(200).json({success : true, message : "chat friend", receiver : receiveByOwner, sender : sendByOwner});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = chat;