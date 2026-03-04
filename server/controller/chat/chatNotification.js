const messageModel = require("../../models/messageModel");
const { userProfileModel } = require("../../models/profileModel");


const chatNotification = async (req, res) => {
  try {
    const userId = req.userId;

    const profileId = await userProfileModel.findOne({ userId: userId });
    const userProfileId = profileId._id;
    const messages = await messageModel.find({receiverId: userProfileId, seen: false }).sort({ createdAt: 1 }).populate("senderId", "profilePhoto username userId _id isOnline updatedAt");

    res.json({success: true, message: "message received", messages});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = chatNotification;
