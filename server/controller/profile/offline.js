const { userProfileModel } = require("../../models/profileModel");

const offline = async (userId) => {
    try {
        if (!userId) {
            return "no id";
        }
        const status = await userProfileModel.findOneAndUpdate({ userId });
        // console.log("id=", userId)
        if (!status) {
            return "no profile";
        }
        // console.log("offline", status);
        let ans = "";
        status.isOnline = false;
        ans = "offline";
        await status.save();
        return ans;
    } catch (error) {
        return error.message;
    }
}
module.exports = offline;