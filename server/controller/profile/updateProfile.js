const { userProfileModel } = require("../../models/profileModel");
const cloudinary = require("../../connection/cloudinary")

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized", });
        }

        const existingUser = await userProfileModel.findOne({ userId });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const {
            username,
            vibe,
            fullname,
            company,
            gender,
            location,
            bio,
            status,
            instagram,
            twitter,
            youtube,
            linkedin,
        } = req.body;

        const updateData = {
            username,
            vibe,
            fullname,
            company,
            gender,
            location,
            bio,
            status,
            instagram,
            twitter,
            youtube,
            linkedin,
        };

        if (req.file) {
            if (existingUser.profilePhotoPublicId) {
                await cloudinary.uploader.destroy(
                    existingUser.profilePhotoPublicId
                );
            }
            updateData.profilePhoto = req.file.path;      // URL
            updateData.profilePhotoPublicId = req.file.filename; // public_id
        }

        const updatedUser = await userProfileModel.findOneAndUpdate(
            { userId: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Profile updation fail",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = updateProfile;
