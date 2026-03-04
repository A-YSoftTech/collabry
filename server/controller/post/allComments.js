const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const getAllComments = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;
        console.log(postId, userId)

        const post = await postModel.findById(postId)
            .populate({
                path: "comments",
                populate: {
                    path: "profileId",
                    select: "profilePhoto username fullname userId"
                }
            });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }


        res.status(200).json({
            success: true,
            message: "All comments",
            post
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = getAllComments;
