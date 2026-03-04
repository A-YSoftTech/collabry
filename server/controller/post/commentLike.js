const { postModel, commentModel } = require("../../models/postModel");
// const { userProfileModel } = require("../../models/profileModel");

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.userId;

    if (!userId || !commentId) {
      return res.status(400).json({ success: false, message: "Comment not found" });
    }

    const comment = await commentModel.findById(commentId);

    if (userId == comment.userId) {
      return res.status(400).json({ success: false, message: "You can't like your comment" });
    }

    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId); // unlike
    } else {
      comment.likes.push(userId); // like
    }


    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment liked',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = likeComment;
