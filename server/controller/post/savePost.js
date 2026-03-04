const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const savePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.userId;

        const post = await postModel.findById(postId);
        // const like = await userProfileModel.findOne({userId : userId})
        // console.log("postid=", postId)
        if (userId == post.userId) {
            return res.status(400).json({ success: false, message: "You can't save your post" });
        }
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });
        const profile = await userProfileModel.findOne({userId});
        if(!profile){
            return res.status(400).json({ success: false, message: "User profile not available" });
        }
        const alreadySaved = profile.savedPost.includes(postId);

        if (alreadySaved) {
            profile.savedPost.pull(postId); // unlike
        } else {
            profile.savedPost.push(postId); // like
        }

        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Post saved'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = savePost;
