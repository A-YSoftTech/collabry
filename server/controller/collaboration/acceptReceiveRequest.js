const collabModel = require("../../models/collabModel");
const { userProfileModel } = require("../../models/profileModel");

const acceptReceiveRequest = async (req, res) => {
    try {
        const myId = req.userId;
        const { acceptId } = req.body;
        if (!myId || !acceptId) {
            return res.status(400).json({ success: false, message: "Ids not available" })
        }
        const updateFriendship = await collabModel.findOneAndUpdate(
            { ownerId: acceptId, userId: myId },
            { status: "friend" },
            { new: true }
        );
        if (!updateFriendship) {
            return res.status(400).json({
                success: false,
                message: "Request not found"
            });
        }
        const myProfile = await userProfileModel.findOneAndUpdate(
            { userId: myId },
            {
                $addToSet: { friends: acceptId } // prevents duplicate
            }
        );
        const friendProfile = await userProfileModel.findOneAndUpdate(
            { userId: acceptId },
            {
                $addToSet: { friends: myId }
            }
        );
        if(!myProfile || !friendProfile){
            return res.status(400).json({message : "Collaboration not done."})
        }
        res.status(200).json({ success: true, message: "You are know friends" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = acceptReceiveRequest;