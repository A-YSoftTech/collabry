const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }],
    text: {
      type: String,
    }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },

    caption: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      default: null,
    },

    filePublicId: {
      type: String,
      default: "none",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }],

    type: {
      type: String,
      enum: ["post", "repost", "status"],
      default: "post"
    },

    // for repost
    originalPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      default: null
    },

    // for status viewers
    viewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }],

    // auto delete status after 24h
    expiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);
const commentModel = mongoose.model("comment", commentSchema);
module.exports = { postModel, commentModel };
