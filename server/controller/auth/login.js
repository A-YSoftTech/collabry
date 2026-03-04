require("dotenv").config();
const userAuthModel = require("../../models/userAuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({success : false, message : "Please enter all the field"});
        }
        const checkEmail = await userAuthModel.findOne({email});
        
        if(!checkEmail){
            return res.status(400).json({success : false, message : "User not exist, Please register first"});
        }
        const checkPassword = await bcrypt.compare(password, checkEmail.password);
        if(!checkPassword){
            return res.status(400).json({success : false, message : "Invalid credentials"});
        }
        if(checkEmail.role === 'block'){
            return res.status(400).json({success: false, message: "Your account is blocked!"})
        }
        const token = jwt.sign({userId : checkEmail._id}, process.env.JWT_KEY, {expiresIn : "1h"});
        res.cookie("token", token, {httpOnly : true, secure : process.env.NODE_ENV === "production", maxAge : 3600000});
        res.status(200).json({
            success : true, 
            message : "Login successfull", 
            loginDetails : {
                email : checkEmail.email, 
                name : checkEmail.username, 
                role : checkEmail.role,
                userId : checkEmail._id,
                token : token,
            }});
    } catch (error) {
        return res.status(500).json({success : false, message : error});
    }
}
module.exports = login;