const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  type:{
    type: String,
    default: "text"

  },
  postId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    default: null
  },
  seen: {
    type: Boolean,
    default: false
  },
  expireAt:{
    type: Date,
    default: null
  }
}, { timestamps: true });

const messageModel = mongoose.model("message", messageSchema);
module.exports = messageModel;
