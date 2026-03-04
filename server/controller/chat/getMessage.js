const messageModel = require("../../models/messageModel");
const { userProfileModel } = require("../../models/profileModel");


const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendProfileId } = req.body;
    // console.log(friendProfileId);

    const profileId = await userProfileModel.findOne({ userId: userId });
    const userProfileId = profileId._id;
    const friendProfile = await userProfileModel.findOne({ _id: friendProfileId });
    const messages = await messageModel.find({
      $or: [
        { senderId: userProfileId, receiverId: friendProfileId },
        { senderId: friendProfileId, receiverId: userProfileId }
      ]
    }).sort({ createdAt: 1 }).populate("senderId", "profilePhoto username userId _id isOnline updatedAt")
      .populate("receiverId", "profilePhoto username userId _id isOnline updatedAt")
      .populate("postId", "fileUrl");

    res.json({
      success: true, message: "message received", history: messages, profile: {
        username: friendProfile.username, profilePhoto: friendProfile.profilePhoto, userId: friendProfile.userId,
        _id : friendProfile._id, isOnline : friendProfile.isOnline, lastSeen : friendProfile.updatedAt
      }
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = getChatHistory;
