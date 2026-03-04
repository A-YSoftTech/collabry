const mongoose = require("mongoose");

const connectDatabase = async (url) => {
    try {
        const connect = await mongoose.connect(url)
            if(connect){
                return console.log("Database connected.")
            }
    } catch (error) {
        return console.log(`ConnectMongoDB function error : ${error}`);
    }
}
module.exports = connectDatabase;