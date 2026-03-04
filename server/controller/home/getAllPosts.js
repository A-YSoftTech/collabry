const { postModel } = require("../../models/postModel");
const { userProfileModel } = require("../../models/profileModel");
const deleteExpiredStatuses = require("../post/delExpireStatus");


const getAllPost = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    if (!userIdFromToken) {
      return res.status(400).json({ success: false, message: "no token" })
    }
    await deleteExpiredStatuses();
    const profile = await userProfileModel.findOne({ userId: userIdFromToken });
    if (!profile) {
      return res.status(400).json({ success: false, message: "Profile not available" })
    }
    const savedPost = profile.savedPost;
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate("profileId", "username profilePhoto status fullname savedPost")
      .populate("originalPostId")
      .populate("comments")
      .populate("likes")
      .populate("viewers")
      .populate({
        path: "originalPostId",
        populate: {
          path: "profileId"
        }
      })

    res.status(200).json({ success: true, message: "Here is your post", posts, savedPost });

  } catch (err) {
    console.log("Get User Posts Error:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = getAllPost;