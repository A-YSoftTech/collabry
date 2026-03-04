const chatBoxModel = require("../../models/chatBoxModel");
const messageModel = require("../../models/messageModel");
const { userProfileModel } = require("../../models/profileModel");

const openSingleChat = async (req, res) => {
  try {
    const userId = req.userId;
    const { profileId } = req.body;

    if (!userId || !profileId) {
      return res.status(400).json({ success: false, message: "No id found" });
    }
    const myProfile = await userProfileModel.findOne({ userId: userId });
    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    let chatBox = await chatBoxModel.findOne({ userId });

    if (chatBox) {
      chatBox.chatOpen = true;
      chatBox.activeProfileId = profileId;
      await chatBox.save();
    } else {
      chatBox = await chatBoxModel.create({
        userId,
        activeProfileId: profileId,
        chatOpen: true
      });
    }

    // 🔹 Mark all messages as seen
    const messageSeen = await messageModel.updateMany(
      {
        senderId: profileId,
        receiverId: myProfile._id,
        seen: false
      },
      {
        $set: { seen: true }
      }
    );

    res.status(200).json({
      success: true,
      message: "Chatbox opening...",
      detail: chatBox
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = openSingleChat;