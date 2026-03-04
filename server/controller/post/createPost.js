

const cloudinary = require("../../connection/cloudinary");
const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");

const createPost = async (req, res) => {
  try {
    const userIdFromToken = req.userId;

    const profile = await userProfileModel.findOne({ userId: userIdFromToken });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const caption = req.body.caption || "";
    const type = req.body.type || "post";

    let fileUrl = null;
    let filePublicId = "none";

    if (req.file) {
      fileUrl = req.file.path;
      filePublicId = req.file.filename;
    }
    let expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    if (type === "post") {
      const post = await postModel.create({
        userId: userIdFromToken,
        profileId: profile._id,
        caption,
        fileUrl,
        filePublicId,
        type: type,
      });

      return res.status(200).json({ success: true, message: "Post created successfully" });
    }
    if (type === "status") {
      const oldStatus = await postModel.findOne({
        userId: userIdFromToken,
        type: "status"
      });

      if (oldStatus) {

        if (oldStatus.filePublicId !== "none") {
          await cloudinary.uploader.destroy(oldStatus.filePublicId);
        }

        await postModel.findByIdAndDelete(oldStatus._id);
      }
      const post = await postModel.create({
        userId: userIdFromToken,
        profileId: profile._id,
        caption,
        fileUrl,
        filePublicId,
        type: type,
        expiresAt: expiresAt
      });

      return res.status(200).json({ success: true, message: "Status created successfully" });
    }



  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ success: true, message: error.message });
  }
};

module.exports = createPost;
