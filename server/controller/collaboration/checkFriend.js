// const collabModel = require("../../models/collabModel");

// const checkFriend = async(req,res)=>{
//     try {
//         const id = req.userId;
//         const {userId} = req.body;

//         if(!id || !userId){
//             return res.status(400).json({success : false, message : "Ids not available"})
//         }
//         const sendByOwner = await collabModel.findOne({ownerId : id, userId : userId});
//         const receiveByOwner = await collabModel.findOne({ownerId : userId, userId : id});
//         if(sendByOwner || receiveByOwner){
//             return res.status(200).json({success : false, message : "block other", type : "you"});
//         }
//         else{

//             return res.status(200).json({success : true, message : "no change", type : "both"});
//         }
//     } catch (error) {
//         res.status(500).json({success : false, message : error.message});
//     }
// }
// module.exports = checkFriend;
const collabModel = require("../../models/collabModel");

const checkFriendStatus = async(req,res)=>{
    try {
        const id = req.userId;
        // const {friendId} = req.body;
        // console.log("friendStatusid = ", friendId)

        if(!id){
            return res.status(400).json({success : false, message : "Information not available"})
        }
        const friendRequest = await collabModel.find({$or:[
            {ownerId : id},
            {userId : id}
        ]});
        if(!friendRequest){
            return res.status(400).json({success : false, message : "No friend request available"});
        }

            res.status(200).json({success : true, message : "Friend requests are available", friendRequest});
        
    } catch (error) {
        console.log("status error = ", error);
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = checkFriendStatus;