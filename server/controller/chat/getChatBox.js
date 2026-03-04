// const chatBoxModel = require("../../models/chatBoxModel");
const checkModel = require("../../models/checkModel");

const getChatBox = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "No id found" });
    }

    // 1️⃣ Check if chatbox already exists
    let chatBox = await checkModel.findOne({ userId });
    // console.log("backend = ", userId, chatBox);
    res.status(200).json({
      success: true,
      message: "Chatbox status",
      detail: chatBox
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = getChatBox;
