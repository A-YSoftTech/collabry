const { userProfileModel } = require("../../models/profileModel");

const searchQuery = async(req,res)=>{
    try {
        const id = req.userId;
        const { query } = req.body;

    if (!id ){
        return res.status(400).json({success : false, message : 'not valid credentials'}); 
    } 

    const users = await userProfileModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } }
      ]
    })
    // .limit(10);

    res.status(200).json({success : true, message : "search completed", users});
        
    } catch (error) {
        return res.status(500).json({success : false, message : error.message})
    }
}
module.exports = searchQuery;