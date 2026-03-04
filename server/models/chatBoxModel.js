const mongoose = require("mongoose");

const chatBoxSchema = new mongoose.Schema({
  userId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "user",
    required : true
  },
  chatOpen:{
    type : Boolean
  },
  activeProfileId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "profile",
  },
});

const chatBoxModel = mongoose.model("chatBox", chatBoxSchema);
module.exports = chatBoxModel;
