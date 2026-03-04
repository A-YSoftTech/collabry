
const { userProfileModel } = require("../../models/profileModel");

const allProfiles = async (req, res) => {
    try {
        const id = req.userId;
        if (!id) {
            return res.status(400).json({ success: false, message: "No token" });
        }
        const response = await userProfileModel.find().populate("userId");
        if (!response) {
            return res.status(400).json({ success: false, message: "No profile exist" });
        }
        res.status(200).json({ success: true, message: "all Profiles", response });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = allProfiles;