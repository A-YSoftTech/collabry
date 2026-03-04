// const cloudinary = require("../connection/cloudinary");
// const { postModel } = require("../models/postModel");

const cloudinary = require("../../connection/cloudinary");
const { postModel } = require("../../models/postModel");

const deleteExpiredStatuses = async () => {
  try {
    const now = new Date(Date.now() - 60 * 1000);

    const expiredPosts = await postModel.find({
      type: "status",
    });

    if (expiredPosts.length === 0) {
      return;
    }

    for (const post of expiredPosts) {
      if (post.expiresAt < now) {
        await cloudinary.uploader.destroy(post.filePublicId);
      }
      // delete from mongodb
      // await postModel.findByIdAndDelete(post._id);
    }

    console.log("Expired statuses cleaned:", expiredPosts.length);

  } catch (error) {
    console.log("deleteExpiredStatus : ", error.message);
  }
};

module.exports = deleteExpiredStatuses;