require("dotenv").config();


const logout = (req, res) => {
    try {
        const token = req.userId;
        if (!token) {
            return res.status(400).json({ success: false, message: "token expire" });
        }
        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.status(200).json({ success: true, message: "Logout successfull" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
}
module.exports = logout;