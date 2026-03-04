const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    const post = await postModel.findById(postId);
    const profile = await userProfileModel.findOne({ userId });

    if (userId == post.userId) {
      return res.status(400).json({ success: false, message: "You can't like your post" });
    }

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    const postSaved = profile.sharedPost.includes(postId)
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId); // unlike
    } else {
      post.likes.push(userId); // like
    }

    if(postSaved){
      profile.sharedPost.pull(postId);
    }else{
      profile.sharedPost.push(postId);
    }

    await post.save();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Post liked',
      // likesCount: post.likes.length,
      //   liked: !alreadyLiked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = likePost;
