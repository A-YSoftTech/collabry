const collabModel = require("../../models/collabModel");
const { userProfileModel } = require("../../models/profileModel");

const sendRequest = async(req,res)=>{
    try {
        const myId = req.userId;
        const {friendId} = req.body;
        if(!myId || !friendId){
            return res.status(400).json({success : false, message : "User information not available"});
        }

        if(myId === friendId){
            return res.status(400).json({success : false, message : "You cannot send request to yourself"});
        }

        const existingRequest = await collabModel.findOne({$or:[
            {ownerId : myId, userId: friendId},
            {ownerId : friendId, userId: myId}
        ]});
        if(existingRequest){
            return res.status(400).json({success: false, message: "Request already send..."})
        }
        
        const myProfile = await userProfileModel.findOne({userId : myId});
        const friendProfile = await userProfileModel.findOne({userId : friendId});
        if(!myProfile || !friendId){
            return res.status(400).json({success: false, message: "Profile not found"})
        }
        
        const response = new collabModel({
            ownerId : myId,
            ownerProfileId : myProfile._id,
            userId : friendId,
            userProfileId : friendProfile._id
        });
        const result = await response.save();
        res.status(200).json({success : true, message : "Collab request send"})
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = sendRequest;