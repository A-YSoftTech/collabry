const { postModel, commentModel } = require("../../models/postModel");
// const { userProfileModel } = require("../../models/profileModel");

const deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId } = req.body;
    console.log("id, comment = ",userId, commentId);
    if(!userId || !commentId){
        return res.status(400).json({message : "Comment not found"})
    }
    const comment = await commentModel.findByIdAndDelete(commentId);
    if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
    }
    const post = await postModel.findOne({_id: comment.postId})
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    post.comments.pull(commentId);
      await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = deleteComment;
