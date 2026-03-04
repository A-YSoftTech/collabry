const { postModel } = require("../../models/postModel");
const cloudinary = require("../../connection/cloudinary");

const adminDeletePost = async (req, res) => {
    try {
        const userId = req.userId;
        const { deleteId } = req.body;

        const post = await postModel.findById(deleteId);

        if (!post || !userId) {
            return res.status(400).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.filePublicId) {
            await cloudinary.uploader.destroy(post.filePublicId);
            console.log("Cloudinary file deleted:", post.filePublicId);
        }

        await postModel.findByIdAndDelete(deleteId);

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

module.exports = adminDeletePost;
