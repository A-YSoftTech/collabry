// const { userProfileModel } = require("../../models/profileModel");

const { userProfileModel } = require("../../models/profileModel");
const mongoose = require("mongoose");

const getFriendSuggestions = async (req, res) => {
    try {

        const myUserId = req.userId;
        const userId = new mongoose.Types.ObjectId(myUserId);

        // 1️⃣ Get current profile
        const currentProfile = await userProfileModel.findOne({ userId });

        if (!currentProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // 2️⃣ Aggregation pipeline
        const suggestions = await userProfileModel.aggregate([

            // Step A: Exclude self
            {
                $match: {
                    userId: { $ne: userId }
                }
            },

            // Step B: Exclude existing friends
            {
                $match: {
                    userId: { $nin: currentProfile.friends }
                }
            },

            // Step C: Calculate mutual friends
            {
                $addFields: {
                    mutualFriends: {
                        $size: {
                            $setIntersection: ["$friends", currentProfile.friends]
                        }
                    }
                }
            },


            // Step E: Calculate common liked posts
            {
                $addFields: {
                    commonLikedPosts: {
                        $size: {
                            $setIntersection: ["$sharedPost", currentProfile.sharedPost]
                        }
                    }
                }
            },

            // Step F: Calculate common saved posts
            {
                $addFields: {
                    commonSavedPosts: {
                        $size: {
                            $setIntersection: ["$savedPost", currentProfile.savedPost]
                        }
                    }
                }
            },

            // Step G: Add total score
            {
                $addFields: {
                    score: {
                        $add: [
                            { $multiply: ["$mutualFriends", 10] },
                            { $multiply: ["$commonLikedPosts", 5] },
                            { $multiply: ["$commonSavedPosts", 5] },

                            {
                                $cond: [
                                    { $eq: ["$company", currentProfile.company] },
                                    6,
                                    0
                                ]
                            },

                            {
                                $cond: [
                                    { $eq: ["$location", currentProfile.location] },
                                    4,
                                    0
                                ]
                            },

                            {
                                $cond: [
                                    { $eq: ["$vibe", currentProfile.vibe] },
                                    6,
                                    0
                                ]
                            }
                        ]
                    }
                }
            },

            // Step H: Sort highest score
            { $sort: { score: -1 } },

            // Step I: Limit to top 10
            { $limit: 10 },
        ]);
        // console.log("suggestion = ", suggestions);
        res.status(200).json({
            success: true,
            suggestions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = getFriendSuggestions;