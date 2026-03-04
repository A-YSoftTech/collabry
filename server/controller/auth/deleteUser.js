const { userProfileModel } = require("../../models/profileModel");
const userAuthModel = require("../../models/userAuthModel");

const deleteUser = async (req, res) => {
    try {
        const adminId = req.userId;
        const { deleteId } = req.body;

        if (!adminId || !deleteId) {
            return res.status(400).json({
                success: false,
                message: "Ids not available"
            });
        }

        const user = await userAuthModel.findByIdAndDelete(deleteId);
        const userprofile = await userProfileModel.findOneAndDelete({userId: deleteId});

        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "User not found"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = deleteUser;