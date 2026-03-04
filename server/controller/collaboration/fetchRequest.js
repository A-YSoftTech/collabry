const collabModel = require("../../models/collabModel");

const fetchRequest = async(req,res)=>{
    try {
        const id = req.userId;

        if(!id){
            return res.status(400).json({success : false, message : "Ids not available"})
        }
        const sendRequest = await collabModel.find({ownerId : id})
        .sort({ createdAt: -1 }).populate("userProfileId", "username fullname profilePhoto");
        const receiveRequest = await collabModel.find({userId : id})
        .sort({ createdAt: -1 }).populate("ownerProfileId", "username fullname profilePhoto");
        res.status(200).json({success : true, message : "fetched sendcollab request", sendRequest, receiveRequest});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = fetchRequest;