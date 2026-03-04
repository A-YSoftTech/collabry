// const chatBoxModel = require("../../models/chatBoxModel");


// const closeChatBox = async (req, res) => {
//     try {
//         const userId = req.userId;
//         if (!userId) {
//             return res.status(400).json({ status: false, message: "No id found" });
//         }
//         let chatBox = await chatBoxModel.findOne({ userId });
//         if (chatBox) {
//             chatBox.chatOpen = false;
//             chatBox.activeProfileId = null;
//             await chatBox.save();
//         }else{
//             return res.status(400).json({success : false, messsage : 'Something went wrong'})
//         }
//         res.status(200).json({ success: true, message: "Chatbox closing...", detail: chatBox })
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message })
//     }
// }
// module.exports = closeChatBox;

// const chatBoxModel = require("../../models/chatBoxModel");
const checkModel = require("../../models/checkModel");

const closeChatBox = async (req, res) => {
    try {
        const userId = req.userId;
        const { profileId } = req.body;
        // console.log("p=", profileId)
        if (!userId || !profileId) {
            return res.status(400).json({ success: false, message: "No id found" });
        }

        const chatBox = await checkModel.findOneAndUpdate(
            { userId },
            { $pull: { activeProfileId: profileId } },
            { new: true }
        );

        if (chatBox.activeProfileId.length === 0) {
            chatBox.chatOpen = false;
            await chatBox.save();
        }


        if (!chatBox) {
            return res.status(404).json({ success: false, message: "Chatbox not found" });
        }

        res.status(200).json({
            success: true,
            message: "Chat closed",
            detail: chatBox
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = closeChatBox;
