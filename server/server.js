require('dotenv').config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const connectDatabase = require('./connection/mongoDB');
const router = require('./routes/userRoutes');

const initSocket = require("./socket"); // 👈 IMPORT SOCKET FILE

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

const server = http.createServer(app);
initSocket(server); // 👈 CONNECT SOCKET FILE

const serverStart = async ()=>{
    try {
        await connectDatabase(process.env.MONGODB_URL);
        server.listen(process.env.PORT, ()=>{
            console.log(`Your server is online `, process.env.PORT)
        })
    } catch (error) {
        console.log(`Index.js page ${error}`)
    }
}
serverStart();