const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const repostPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;

        const myProfile = await userProfileModel.findOne({userId});
        const originalPost = await postModel.findById(postId);

        if (!originalPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newRepost = await postModel.create({
            userId,
            caption: "Reposted",
            profileId: myProfile._id,
            fileUrl: originalPost.fileUrl,
            filePublicId : originalPost.filePublicId,
            type: "repost",
            originalPostId: postId
        });

        res.status(200).json({
            message: "Reposted successfully",
            post: newRepost
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports=repostPost;