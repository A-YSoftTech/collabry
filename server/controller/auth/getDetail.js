const userAuthModel = require("../../models/userAuthModel");

const getDetails = async(req, res)=>{
    try {
        const id = req.userId;
        if(!id){
            return res.status(400).json({success : false, message : "Token not available"});
        }
        const response = await userAuthModel.findById(id);
        if(!response){
            return res.status(400).json({success : false, message : "User not exist"});
        }
        res.status(200).json({success : true, message : "Fetch successfull", details : {name : response.username,id : response._id}});
    } catch (error) {
        return res.status(500).json({success: false, message : error.message});
    }
}
module.exports = getDetails;