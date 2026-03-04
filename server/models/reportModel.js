const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "user",
    required : true
  },
  reportId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required : true
  },
});

const reportModel = mongoose.model("report", reportSchema);
module.exports = reportModel;
