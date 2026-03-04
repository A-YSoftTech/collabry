

const { postModel } = require("../../models/postModel");
const userAuthModel = require("../../models/userAuthModel");


const fetchPost = async (req, res) => {
    try {
        const userId = req.userId;
        const {postId} = req.body;
        if(!postId || !userId){
            return res.status(400).json({ success: false, message: "Post not exist" });
        }
        const posts = await postModel.findById(postId);
        // const likesDetail = await postModel.findById(postId).populate("likes", "username profilePhoto fullname userId");
        // const commentsDetail = await postModel.findById(postId).populate("comments.userId", "username profilePhoto fullname userId");
        if (!posts) {
            return res.status(400).json({ success: false, message: "No user exist under this id" });
        }
        res.status(200).json({success: true, message: "fetch post", posts});

    } catch (err) {
        console.log("Get User Posts Error:", err);
       return res.status(500).json({ message: err.message });
    }
};


module.exports = fetchPost;