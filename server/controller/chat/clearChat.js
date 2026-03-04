const messageModel = require("../../models/messageModel");
const { userProfileModel } = require("../../models/profileModel");

const clearChat = async (req, res) => {
    try {
        const userId = req.userId;
        const { profileId } = req.body;
        if (!userId || !profileId) {
            return res.status(400).json({ message: "Ids not available" })
        }
        const myProfile = await userProfileModel.findOne({userId});
        const deleteMsg = await messageModel.deleteMany({
            $or: [
                { senderId: myProfile._id, receiverId: profileId },
                { senderId: profileId, receiverId: myProfile._id }
            ]
        });
        res.status(200).json({ message: "delete successfull" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
module.exports = clearChat;