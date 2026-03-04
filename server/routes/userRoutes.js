const express = require("express");
const router  = express.Router();


const verifyToken = require("../middleware/middlewareAuth");
const register = require("../controller/auth/register");
const login = require("../controller/auth/login");
const logout = require("../controller/auth/logout");
const getDetails = require("../controller/auth/getDetail");
const updatePassword = require("../controller/auth/updatePassword");
const updateProfile = require("../controller/profile/updateProfile");
const upload = require("../middleware/uploadImage");
const createProfile = require("../controller/profile/createProfile");
const getProfile = require("../controller/profile/getProfile");
const createPost= require("../controller/post/createPost");
const getPost = require("../controller/post/getPost");
const fetchPost = require("../controller/post/fetchPost");
const updatePost = require("../controller/post/updatePost");
const deletePost = require("../controller/post/deletePost");
const getAllPost = require("../controller/home/getAllPosts");
const sendRequest = require("../controller/collaboration/sendRequest");
const fetchRequest = require("../controller/collaboration/fetchRequest");
// const deleteRequest = require("../controller/collaboration/deleteSendRequest");
const deleteSendRequest = require("../controller/collaboration/deleteSendRequest");
const deleteReceiveRequest = require("../controller/collaboration/deleteReceiveRequest");
const checkFriend = require("../controller/collaboration/checkFriend");
const acceptReceiveRequest = require("../controller/collaboration/acceptReceiveRequest");
const blockRequest = require("../controller/collaboration/blockRequest");
const checkCollaboration = require("../controller/collaboration/checkCollaboration");
const searchQuery = require("../controller/home/searchQuery");
const likePost = require("../controller/post/likePost");
const addOrUpdateComment = require("../controller/post/createComment");
const chat = require("../controller/chat/chat");
const getChatHistory = require("../controller/chat/getMessage");
const createChatHistory = require("../controller/chat/createMessage");
const openChatBox = require("../controller/chat/openChatBox");
const closeChatBox = require("../controller/chat/closeChatBox");
const getChatBox = require("../controller/chat/getChatBox");
const generateBio = require("../controller/profile/generateBio");
const engagementScore = require("../controller/post/engagementScore");
const smartReply = require("../controller/chat/smartReply");
const myDetails = require("../controller/auth/myDetails");
const checkProfileExistence = require("../controller/profile/getProfile");
const userProfile = require("../controller/profile/getProfileFromUserId");
const usernameProfile = require("../controller/profile/usernameProfile");
const savePost = require("../controller/post/savePost");
const checkFriendStatus = require("../controller/collaboration/checkFriend");
const openSingleChat = require("../controller/chat/openSingleChat");
const openPost = require("../controller/post/openPost");
const friendCollaboration = require("../controller/chat/friendCollaboration");
const getAllComments = require("../controller/post/allComments");
const deleteComment = require("../controller/post/deleteComment");
const likeComment = require("../controller/post/commentLike");
const getFriendSuggestions = require("../controller/home/suggestion");
const chatNotification = require("../controller/chat/chatNotification");
const openSingleChatBox = require("../controller/chat/openSingleChatBox");
const clearChat = require("../controller/chat/clearChat");
const repostPost = require("../controller/post/repost");
const allChat = require("../controller/chat/allChats");
const allProfiles = require("../controller/profile/adminProfiles");
const adminGetProfile = require("../controller/profile/adminGetProfile");
const blockUser = require("../controller/auth/blockUser");
const deleteUser = require("../controller/auth/deleteUser");
const adminDeletePost = require("../controller/post/adminDeletePost");
const makeAdmin = require("../controller/auth/makeAdmin");
const report = require("../controller/home/report");
const getReport = require("../controller/home/getReport");



// authentication
router.get("/myDetails", verifyToken, myDetails);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/resetPassword", updatePassword);
router.post("/blockUser", verifyToken, blockUser);
router.post("/deleteUser", verifyToken, deleteUser);
router.post("/makeAdmin", verifyToken, makeAdmin);
router.post("/report", verifyToken, report);
router.get("/getReports", verifyToken, getReport);

// popProfile
router.post("/checkProfileExistence", verifyToken, checkProfileExistence);
router.post("/createProfile", verifyToken, createProfile);

// profile
router.post("/userProfile", verifyToken, userProfile);
router.post("/updateProfile", verifyToken, upload.single("image"), updateProfile);

router.post("/generateBio", verifyToken, generateBio);

router.post("/usernameProfile", verifyToken, usernameProfile);

router.get("/allProfiles", verifyToken, allProfiles);
router.post("/adminGetProfile", verifyToken, adminGetProfile);

// post
router.get("/getAllPost", verifyToken, getAllPost);

router.post("/getPost", verifyToken, getPost);
router.post("/openPost", verifyToken, openPost);
router.post("/fetchPost", verifyToken, fetchPost);

router.post("/createPost", verifyToken, upload.single("image"), createPost);
router.post("/updatePost", verifyToken, upload.single("image"), updatePost);
router.post("/deletePost", verifyToken, deletePost);
router.post("/likePost", verifyToken, likePost);
router.post("/savePost", verifyToken, savePost);
router.post("/engagementScore", verifyToken, engagementScore);

router.post("/getAllComments", verifyToken, getAllComments);
router.post("/sendComment", verifyToken, addOrUpdateComment);
router.post("/deleteComment", verifyToken, deleteComment);
router.post("/likeComment", verifyToken, likeComment);
router.post("/repost", verifyToken, repostPost);
router.post("/deleteAdminPost", verifyToken, adminDeletePost);


// chat
router.get("/chat", verifyToken, chat);
router.post("/openSingleChat", verifyToken, openSingleChat);

router.get("/checkChat", verifyToken, getChatBox);
router.post("/chatHistory", verifyToken, getChatHistory);
router.post("/sendText", verifyToken, createChatHistory);
router.post("/openChat", verifyToken, openChatBox);
router.post("/closeChat", verifyToken, closeChatBox);

router.post("/clearChat", verifyToken, clearChat);
router.post("/smartReply", verifyToken, smartReply);
router.get("/singleChatBox", verifyToken, openSingleChatBox);
router.get("/allChats", verifyToken, allChat);


// friend request
router.post("/sendFriendRequest", verifyToken, sendRequest);
router.get("/checkFriendStatus", verifyToken, checkFriendStatus);

router.post("/deleteSendRequest", verifyToken, deleteSendRequest);
router.post("/rejectReceiveRequest", verifyToken, deleteReceiveRequest);
router.post("/acceptReceiveRequest", verifyToken, acceptReceiveRequest);
router.post("/blockRequest", verifyToken, blockRequest);
router.post("/checkCollaboration", verifyToken, checkCollaboration);

router.post("/friendCollaboration", verifyToken, friendCollaboration);


// notification
router.get("/notification", verifyToken, fetchRequest);
router.get("/chatNotification", verifyToken, chatNotification);

// search friend
router.post("/searchQuery", verifyToken, searchQuery);






router.get("/friendSuggestion", verifyToken, getFriendSuggestions);
router.get("/getDetails", verifyToken, getDetails);

module.exports = router;