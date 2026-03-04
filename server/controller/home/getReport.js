
const reportModel = require("../../models/reportModel");


const getReport = async(req,res)=>{
    try {
        const userId = req.userId;

        if(!userId){
            return res.status(400).json({success : false, message : "Ids not available"})
        }
        const getReport = await reportModel.find().populate("reportId").populate("userId").populate({
            path:"reportId",
            populate:{
                path:"userId"
            }
        });
        if(!getReport){
            return res.status(400).json({success : false, message : "Report not available"})
        }
        res.status(200).json({success : true, message : "getReport successfull", getReport});
    } catch (error) {
        res.status(500).json({success : false, message : error.message});
    }
}
module.exports = getReport;