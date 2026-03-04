const { postModel } = require("../../models/postModel");
const cloudinary = require("../../connection/cloudinary");

const deletePost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;

        // 1. Find post first
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post not found"
            });
        }

        // Optional security check
        if (post.userId.toString() !== userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 2. Delete from Cloudinary
        if (post.filePublicId) {
            await cloudinary.uploader.destroy(post.filePublicId);
            console.log("Cloudinary file deleted:", post.filePublicId);
        }

        // 3. Delete from MongoDB
        await postModel.findByIdAndDelete(postId);

        res.json({
            success: true,
            message: "Post and file deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = deletePost;
