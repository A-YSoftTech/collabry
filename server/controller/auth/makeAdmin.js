const userAuthModel = require("../../models/userAuthModel");

const makeAdmin = async (req, res) => {
    try {
        const adminId = req.userId;
        const { userId } = req.body;

        if (!adminId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Ids not available"
            });
        }

        const user = await userAuthModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const newRole = user.role === "user" ? "admin" : "user";

        user.role = newRole;

        await user.save();

        res.status(200).json({
            success: true,
            message: "adminSuccessfully",
            role: newRole
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = makeAdmin;