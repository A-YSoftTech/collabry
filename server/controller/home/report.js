const { postModel } = require("../../models/postModel");
const reportModel = require("../../models/reportModel");


const report = async(req,res)=>{
    try {
        const userId = req.userId;
        const {postId} = req.body;

        if(!userId || !postId){
            return res.status(400).json({success : false, message : "Ids not available"})
        }
        const post = await postModel.findById(postId);
        if(!post){
            return res.status(400).json({success : false, message : "Post not available"})
        }
        const report = new reportModel({
            userId,
            reportId: post.profileId
        });
        await report.save();
        res.status(200).json({success : true, message : "report successfull"});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = report;