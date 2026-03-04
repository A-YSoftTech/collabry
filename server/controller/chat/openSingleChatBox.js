const chatBoxModel = require("../../models/chatBoxModel");

const openSingleChatBox = async(req, res)=>{
    try {
        const userId = req.userId;

        if(!userId){
            return res.status(400).json({message : "Id not found"})
        }
        const chatbox = await chatBoxModel.findOne({userId});
        if(!chatbox){
            return res.status(400).json({message : "chatbox not found"})
        }
        res.status(200).json({success : true, message : "chatbox opened", chatbox});
        
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}
module.exports = openSingleChatBox;