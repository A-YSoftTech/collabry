
const { userProfileModel } = require("../../models/profileModel");

const checkProfileExistence = async (req, res) => {
    try {
        const id = req.userId;
        if (!id) {
            return res.status(400).json({ success: false, message: "No token" });
        }
        const response = await userProfileModel.findOne({ userId: id });
        if (!response) {
            return res.status(400).json({ success: false, message: "Please create profile" });
        }
        res.status(200).json({ success: true, message: "Welcome " });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = checkProfileExistence;