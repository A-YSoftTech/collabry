const mongoose = require("mongoose");

const collabRequestSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  ownerProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  userProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true
  },
  status : {
    type : String,
    default : "pending"
  }
}, { timestamps: true });

const collabModel = mongoose.model("request", collabRequestSchema);
module.exports = collabModel;