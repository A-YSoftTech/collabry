const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    fullname: {
        type: String,
    },

    vibe: {
        type: String,
        default: "confused"
    },

    company: {
        type: String,
        default: "college/company"
    },

    profilePhoto: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s"
    },
    profilePhotoPublicId: {
        type: String,
    },

    bio: {
        type: String,
        maxLength: 150,
        default: "Enter you bio here"
    },
    gender: {
        type: String,
        default: "Gender"
    },

    location: {
        type: String,
        default: "District,State"
    },

    savedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],
    
    sharedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],

    isOnline: {
        type: Boolean,
        default: false
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],

    status: {
        type: String,
        default: "public"
    },

    instagram: {
        type: String,
        default: "https://www.instagram.com"
    },
    twitter: {
        type: String,
        default: "https://www.twitter.com"
    },
    youtube: {
        type: String,
        default: "https://www.youtube.com"
    },
    linkedin: {
        type: String,
        default: "https://www.linkedin.com"
    },

}, { timestamps: true });


const userProfileModel = mongoose.model('profile', profileSchema)
module.exports = { userProfileModel }

