const userAuthModel = require("../../models/userAuthModel");

const myDetails = async(req, res)=>{
    try {
        const id = req.userId;
        if(!id){
            return res.status(400).json({success : false, message : "Token not available"});
        }
        const response = await userAuthModel.findById(id);
        if(!response){
            return res.status(400).json({success : false, message : "User is cannot exist"});
        }
        res.status(200).json({success : true, message : "Fetch successfull", detail : {userId : response._id, email : response.email} });
    } catch (error) {
        return res.status(500).json({success: false, message : error.message});
    }
}
module.exports = myDetails;