const collabModel = require("../../models/collabModel");

const deleteReceiveRequest = async(req,res)=>{
    try {
        const id = req.userId;
        const {deleteId} = req.body;

        if(!id || !deleteId){
            return res.status(400).json({success : false, message : "Ids not available"})
        }
        const findOwner = await collabModel.findOneAndDelete({ownerId : deleteId, userId : id});
        if(!findOwner){
            return res.status(400).json({success : false, message : "User not deleted"})
        }
        res.status(200).json({success : true, message : "Delete receive request"});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = deleteReceiveRequest;