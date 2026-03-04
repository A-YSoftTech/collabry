const { userProfileModel } = require("../../models/profileModel");

const online = async (userId) => {
    try {
        if (!userId) {
            return "no id";
        }
        const status = await userProfileModel.findOneAndUpdate({ userId });
        // console.log("id=", userId)
        if (!status) {
            return "no profile";
        }
        // console.log("postCount", status);
        let ans = "";
        status.isOnline = true;
        ans = "online";
        await status.save();
        return ans;
    } catch (error) {
        return error.message;
    }
}
module.exports = online;