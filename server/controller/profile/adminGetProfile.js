
const { userProfileModel } = require("../../models/profileModel");

const adminGetProfile = async (req, res) => {
    try {
        const id = req.userId;
        const {userId} = req.body;
        if (!id || !userId) {
            return res.status(400).json({ success: false, message: "No token" });
        }
        const response = await userProfileModel.findOne({userId}).populate("userId");
        if (!response) {
            return res.status(400).json({ success: false, message: "No profile exist" });
        }
        res.status(200).json({ success: true, message: "get by userid Profiles", response });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = adminGetProfile;