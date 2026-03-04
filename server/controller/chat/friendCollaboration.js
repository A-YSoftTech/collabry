const collabModel = require("../../models/collabModel");

const friendCollaboration = async(req,res)=>{
    try {
        const id = req.userId;
        const {friendId} = req.body;
        console.log("friendid = ", friendId);
        if(!id){
            return res.status(400).json({success : false, message : "Id not available"})
        }
        const sendByOwner = await collabModel.find({ownerId : friendId, status : "friend"}).populate("userProfileId", "profilePhoto username fullname isOnline updatedAt");
        const receiveByOwner = await collabModel.find({status : "friend", userId : friendId}).populate("ownerProfileId", "profilePhoto username fullname isOnline updatedAt");
        // console.log(sendByOwner, receiveByOwner)
        res.status(200).json({success : true, message : "chat friend", receiver : receiveByOwner, sender : sendByOwner});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = friendCollaboration;