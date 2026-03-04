const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const getPost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        const { userId } = req.body;
        if (!userIdFromToken) {
            return res.status(400).json({ success: false, message: "No token" });
        }
        if (userId) {
            const posts = await postModel
                .find({ userId: userId })
                .sort({ createdAt: -1 })
                .populate("profileId", "username profilePhoto");

            return res.status(200).json({ success: true, message: "Here is your post", posts, ownerId : userIdFromToken });
        } else {
            const posts = await postModel
                .find({ userId: userIdFromToken })
                .sort({ createdAt: -1 })
                .populate("profileId", "username profilePhoto fullname");
            return res.status(200).json({ success: true, message: "Here is your post", posts });
        }
    } catch (err) {
        console.log("Get User Posts Error:", err);
        res.status(500).json({ message: err.message });
    }
};
module.exports = getPost;