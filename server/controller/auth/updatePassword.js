const userAuthModel = require("../../models/userAuthModel");
const bcrypt = require("bcrypt");

const updatePassword = async(req,res)=>{
    try {
        const {email, password, confirmPassword} = req.body;
        if(!email || !password || !confirmPassword){
            return res.status(400).json({success : false, message : "Please enter all the fields"});
        }
        const checkEmail = await userAuthModel.findOne({email});
        if(!checkEmail){
            return res.status(400).json({success : false, message : "User not exist"});
        }
        if(password != confirmPassword){
            return res.status(400).json({success : false, message : "Please write your password correctly"});
        }
        const newPassword = await bcrypt.hash(password,10);
        const response = await userAuthModel.findByIdAndUpdate(checkEmail._id, {password : newPassword},{new : true});
        res.status(200).json({success : true, message : "Password updated"});
    } catch (error) {
        return res.status(500).json({success : false, message : error});
    }
}
module.exports=updatePassword;