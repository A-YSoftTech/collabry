const userAuthModel = require("../../models/userAuthModel");

const blockUser = async (req, res) => {
    try {
        const adminId = req.userId;
        const { blockId } = req.body;

        if (!adminId || !blockId) {
            return res.status(400).json({
                success: false,
                message: "Ids not available"
            });
        }

        const user = await userAuthModel.findById(blockId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const newRole = user.role === "block" ? "user" : "block";

        user.role = newRole;

        await user.save();

        res.status(200).json({
            success: true,
            message: newRole === "block"
                ? "User blocked successfully"
                : "User unblocked successfully",
            role: newRole
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = blockUser;