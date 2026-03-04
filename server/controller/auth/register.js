const userAuthModel = require("../../models/userAuthModel");
const bcrypt = require("bcrypt");


const register = async (req, res) => {
    try {
        const { username, phone, role, email, password } = req.body;
        if (!username || !phone || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all the fields" });
        }
        const existingUser = await userAuthModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exist, please login" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const data = new userAuthModel({ username, phone, role, email, password: hashPassword });
        const result = await data.save();
        res.status(200).json({ success: true, message: "Registeration successfull!" });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.phone) {
            return res.status(409).json({ message: "Phone number already registered" });
        }
        return res.status(500).json({ success: false, message: error.message })
    }
}
module.exports = register;