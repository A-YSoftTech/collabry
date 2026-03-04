const { userProfileModel } = require("../../models/profileModel");

const createProfile = async (req, res) => {
    try {
        const id = req.userId;
        if (!id) {
            return res.status(400).json({ success: false, message: "Sorry, you not valid token" });
        }
        let { username, fullname, vibe, location } = req.body;
        if (!username || !fullname || !vibe || !location) {
            return res.status(400).json({ success: false, message: "Please fill all the field" });
        }
        const usernameRegex = /^(?![-_!])[a-zA-Z0-9-_!]{3,20}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: "Username must be 3–20 chars, letters, numbers, -, _, ! and cannot start with special character" });
        }
        username = username.toLowerCase().trim();
        fullname = fullname.trim();
        vibe = vibe.trim();
        location = location.trim();
        const existing = await userProfileModel.findOne({ username });
        if (existing) {
            return res.status(400).json({ success: false, message: "Username not available" });
        }
        const create = new userProfileModel({ userId: id, username, fullname, vibe, location });
        const data = await create.save();
        // console.log(data);
        res.status(200).json({
            success: true,
            message: "Profile created"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = createProfile;