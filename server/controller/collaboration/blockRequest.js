const collabModel = require("../../models/collabModel");

const blockRequest = async(req,res)=>{
    try {
        const id = req.userId;
        const {userId} = req.body;

        if(!id || !userId){
            return res.status(400).json({success : false, message : "Ids not available"})
        }
        const findOwner1 = await collabModel.findOneAndDelete({ownerId : id, userId : userId});
        const findOwner2 = await collabModel.findOneAndDelete({ownerId : userId, userId : id});
        if(findOwner1){
            return res.status(200).json({success : true, message : "User deleted"})
        }else if(findOwner2){
            return res.status(200).json({success : true, message : "User deleted"})
        }else{
            res.status(200).json({success : true, message : "not deleted"});
        }
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = blockRequest;