const mongoose = require("mongoose");

const userAuthSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        default : "user"
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
});

const userAuthModel = mongoose.model("user", userAuthSchema);
module.exports = userAuthModel;