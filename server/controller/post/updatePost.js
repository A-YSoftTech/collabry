// const {postModel} = require("../../models/post");

const cloudinary = require("../../connection/cloudinary");
const { postModel } = require("../../models/postModel");

const updatePost = async (req, res) => {
  // console.log("req body = ", req.body);
  try {
    const { id, caption, file } = req.body;

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(400).json({ success: false, message: "Post not exist" })
    }
    let updateData = { caption };
    console.log("filepublicid = ", post.filePublicId);
    if (req.file) {
      if (post.filePublicId) {
        await cloudinary.uploader.destroy(
          post.filePublicId
        );
      }
      updateData.fileUrl = req.file.path;      // URL
      updateData.filePublicId = req.file.filename; // public_id
    }

    else if (file) {
      updateData.fileUrl = file;
    }

    const updated = await postModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({ success: true, message: "Update successfelly!", updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = updatePost;