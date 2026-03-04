const chatBoxModel = require("../../models/chatBoxModel");
const messageModel = require("../../models/messageModel");
const { userProfileModel } = require("../../models/profileModel");


const createChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendProfileId, sendText, type, postId } = req.body;

    const profileId = await userProfileModel.findOne({ userId: userId });
    const myProfileId = profileId._id;
    // console.log(userProfileId);
    const friendProfile = await userProfileModel.findById(friendProfileId);
    const friendUserId = friendProfile.userId;


    const checkFriendChatBox = await chatBoxModel.findOne({ userId: friendUserId, activeProfileId: myProfileId })
    
    let seenStatus = false;

    if (checkFriendChatBox) {
      seenStatus = true;
    }

    // Step 4: create message
    const message = await messageModel.create({
      senderId: myProfileId,
      receiverId: friendProfileId,
      text: sendText,
      type: type,
      postId: postId,
      seen: seenStatus
    });
    const populatedMessage = await messageModel
      .findById(message._id)
      .populate("senderId", "profilePhoto username userId")
      .populate("receiverId", "profilePhoto username userId")
      .populate("postId", "fileUrl");
    // console.log(message)
    res.json({ success: true, message: "message sended", history: populatedMessage });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = createChatHistory;
