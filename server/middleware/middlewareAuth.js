require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async(req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({success : false, message : "Token not available", token : false});
        }
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decode.userId;
        next();
    } catch (error) {
        return res.status(500).json({success : false, message : error});
    }
}
module.exports = verifyToken;