const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const openPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;
        // console.log("postid = ", postId)
        if (!userId || !postId) {
            return res.status(400).json({ success: false, message: "Ids not found" });
        }
        const myProfile = await userProfileModel.findOne({userId});
        const postDetail = await postModel
            .findOne({ _id: postId })
            .populate("profileId", "username fullname status profilePhoto");
        if (!postDetail) {
            return res.status(400).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, message: "Here is your post", postDetail, myProfile });
    } catch (err) {
        console.log("Get User Posts Error:", err);
        res.status(500).json({ message: err.message });
    }
};
module.exports = openPost;