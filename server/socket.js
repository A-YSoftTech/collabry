require('dotenv').config();
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Your existing controllers
const createChatHistory = require("./controller/chat/createMessage");
const getChatHistory = require("./controller/chat/getMessage");
const getChatBox = require('./controller/chat/getChatBox');
const openChatBox = require('./controller/chat/openChatBox');
const closeChatBox = require('./controller/chat/closeChatBox');
// const onlineOffline = require('./controller/profile/online');
const online = require('./controller/profile/online');
const offline = require('./controller/profile/offline');

let io; // will store socket server instance

const initSocket = (server) => {
    // Attach socket.io to HTTP server
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    // socket middleware
    io.use((socket, next) => {
        try {
            const cookie = socket.handshake.headers.cookie;
            if (!cookie) return next(new Error("No cookie"));

            const token = cookie
                .split("; ")
                .find(c => c.startsWith("token="))
                ?.split("=")[1];

            if (!token) return next(new Error("No token"));

            const decoded = jwt.verify(token, process.env.JWT_KEY);
            socket.user = decoded;

            next();
        } catch (err) {
            next(new Error("Authentication failed"));
        }
    });

    // socket connection
    io.on("connection", async (socket) => {
        console.log("User connected:", socket.user.userId);

        // Join user-specific room
        socket.join(socket.user.userId);

        const result = await online(socket.user.userId);
        console.log("status", result);

        // Send chat history when user connects 
        socket.on("getChatHistory", async ({ friendProfileId }) => {
            const fakeReq = {
                userId: socket.user.userId,
                body: { friendProfileId }
            };

            const fakeRes = {
                status: () => fakeRes,
                json: (data) => socket.emit("chatHistory", data)
            };

            await getChatHistory(fakeReq, fakeRes);
        });

        // ---- Receive new message ----
        socket.on("sendMessage", async ({ friendProfileId, text, type, postId }) => {
            const fakeReq = {
                userId: socket.user.userId,
                body: { 
                    friendProfileId, 
                    sendText: text,
                    type,
                    postId
                 }
            };

            const fakeRes = {
                status: () => fakeRes,
                json: (data) => {
                    if (!data.success) {
                        socket.emit("chatError", data);
                        return;
                    }

                    // Emit only the populated message
                    const messageDoc = data.history; // this is populatedMessage from controller

                    const senderRoom = messageDoc.senderId.userId.toString();
                    const receiverRoom = messageDoc.receiverId.userId.toString();

                    // Emit to sender
                    io.to(senderRoom).emit("receiveMessage", messageDoc);

                    // Emit to receiver
                    io.to(receiverRoom).emit("receiveMessage", messageDoc);

                }
            };

            await createChatHistory(fakeReq, fakeRes);
        });

        socket.on("checkChatBox", async()=>{
            const fakeReq = {
                userId : socket.user.userId
            };
            
            const fakeRes = {
                status: ()=>fakeRes,
                json: (data)=> io.to(socket.user.userId).emit("chatBoxStatus", data.detail)
            };
            await getChatBox(fakeReq,fakeRes);
        });

        socket.on("openChatBox", async({profileId})=>{
            const fakeReq = {
                userId : socket.user.userId,
                body : {profileId}
            };

            const fakeRes = {
                status: ()=> fakeRes,
                json: (data)=> io.to(socket.user.userId).emit("chatBoxStatus", data.detail)
            };
            await openChatBox(fakeReq, fakeRes);
        });

        socket.on("closeChatBox", async({profileId})=>{
            const fakeReq = {
                userId : socket.user.userId,
                body : {profileId}
            };
            const fakeRes = {
                status : ()=> fakeRes,
                json: (data)=> io.to(socket.user.userId).emit("chatBoxStatus", data.detail)
            };
            await closeChatBox(fakeReq, fakeRes);
        })

        // ---- Disconnect ----
        socket.on("disconnect", async() => {
            console.log("User disconnected:", socket.user.userId);
            const result = await offline(socket.user.userId);
            console.log("status= ", result);
        });
    });
};

// Export init function
module.exports = initSocket;
