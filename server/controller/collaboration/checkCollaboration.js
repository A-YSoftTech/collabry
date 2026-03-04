const collabModel = require("../../models/collabModel");

const checkCollaboration = async(req,res)=>{
    try {
        const id = req.userId;
        const {userId} = req.body;

        if(!id || !userId){
            return res.status(400).json({success : false, message : "Ids not available"})
        }
        const sender = await collabModel.countDocuments({userId : userId, status : "friend"});
        const receiver = await collabModel.countDocuments({ownerId : userId, status : "friend"});
        const result = (sender + receiver);
        
        res.status(200).json({success : true, message : "collaboration count", result});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = checkCollaboration;