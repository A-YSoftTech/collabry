
const { userProfileModel } = require("../../models/profileModel");

const usernameProfile = async (req, res) => {
    try {
        const id = req.userId;
        const {username} = req.body;
        console.log("username= ", username);
        if (!id) {
            return res.status(400).json({ success: false, message: "No token" });
        }
        const response = await userProfileModel.findOne({ username }).populate("savedPost", "fileUrl").populate("sharedPost", "fileUrl");
        if (!response) {
            return res.status(400).json({ success: false, message: "Please create profile" });
        }
        res.status(200).json({ success: true, message: "got it", response });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = usernameProfile;