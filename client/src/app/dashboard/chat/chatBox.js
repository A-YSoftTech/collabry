"use client"
import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

// import { io } from "socket.io-client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "../../../styles/dashboard/chatBox/page.module.css"
import getSocket from "@/app/context/getSocket";
import { AppContext } from "@/app/context/appProvider";
import Post from "../post/post";
export default function ChatBox({ profileId, index, isCenter, type }) {

    const router = useRouter();
    const bottomRef = useRef(null);
    const boxRef = useRef(null);
    const socketRef = useRef(null);
    const { owner, chatType, setChatType, sharePostId, setSharePostId } = useContext(AppContext);
    const userId = owner?.userId;

    const [lastSeen, setLastSeen] = useState(false);
    const [reply1, setReply1] = useState("");
    const [reply2, setReply2] = useState("");
    const [reply3, setReply3] = useState("");

    const [mode, setMode] = useState("");
    const [postId, setPostId] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);

    const [isMax, setIsMax] = useState(false);
    const [screen, setScreen] = useState([800, 600]);
    const [floatscreen, setFloatScreen] = useState([300, 190]);
    const [profile, setProfile] = useState({});
    const [history, setHistory] = useState([]);
    const [sendText, setSendText] = useState("");
    const [clearMsg, setClearMsg] = useState(false);
    const friendProfileId = profileId;

    // console.log("screen = ", screen)
    const POSITIONS = [
        // { inset: "0", margin: "auto" },
        // { top: "10px", left: "10px" },
        // { bottom: "10px", left: "10px" },
        { bottom: "0px", right: "0px" },
        { top: "0px", right: "0px" },
    ];

    const position = isCenter ? POSITIONS[0] : POSITIONS[index] || POSITIONS[1];
    const [layout, setLayout] = useState(position);

    const width = isMax ? screen[0] : floatscreen[0];
    const height = isMax ? screen[1] : floatscreen[1];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return `${diff}s`;
        if (diff < 60 * 60) return `${Math.floor(diff / 60)}m`;
        if (diff < 60 * 60 * 24) return `${Math.floor(diff / (60 * 60))}h`;
        if (diff < 60 * 60 * 24 * 7) return `${Math.floor(diff / (60 * 60 * 24))}d`;
        if (diff < 60 * 60 * 24 * 30) return `${Math.floor(diff / (60 * 60 * 24 * 7))}w`;
        if (diff < 60 * 60 * 24 * 365) return `${Math.floor(diff / (60 * 60 * 24 * 30))}mnt`;
        return `${Math.floor(diff / (60 * 60 * 24 * 365))}y`;
    };
    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Message copied to clipboard!");
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }
    const smartReply = async (text) => {
        try {
            const res = await fetch(`http://localhost:9876/smartReply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text }),
            });

            const result = await res.json();
            if (!res.ok) {
                // console.log("res = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            console.log("replies =:", result);
            setReply1(result.reply1);
            setReply2(result.reply2);
            setReply3(result.reply3);
            // toast.success("Fetched all post!");
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setScreen([w - 40, h - 40]);
        if (w > 1000) {
            setFloatScreen([w * 0.30, h * 0.45])
        }
        if (w > 500 && w < 1000) {
            setFloatScreen([w * 0.60, h * 0.40])
        }
        if (w < 500) {
            setFloatScreen([w, h * 0.40])
        }
    }, []);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [history]);
    useEffect(() => {
        if (chatType === "post") {
            setSendText("Post Link");
        }
    }, []);

    const socket = getSocket();
    useEffect(() => {
        socket.emit("getChatHistory", {
            friendProfileId: profileId
        });

        // Receive chat history from backend
        socket.on("chatHistory", (data) => {
            // console.log("📜 chatHistory:", data);
            setLastSeen(data.profile?.isOnline);
            if (data.profile?._id !== profileId) {
                return;
            }
            setHistory(data.history || []);
            setProfile(data.profile || {});
        });

        // Receive new message
        socket.on("receiveMessage", (message) => {
            // console.log("💬 New message:", message);
            const senderId = message.senderId?._id;
            const receiverId = message.receiverId?._id;
            if (senderId === profileId) {
                smartReply(message.text);
            }

            if (senderId !== profileId && receiverId !== profileId) return;
            setHistory((prev) => [...prev, message]);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket error:", err.message);
            toast.error("Socket connection failed");
        });
        setClearMsg(false);

        return () => {
            socket.off("chatHistory");
            socket.off("receiveMessage");
        };
    }, [profileId, clearMsg]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!sendText.trim()) return toast.error("Message cannot be empty");

        let message = {};
        if (chatType === "post") {
            message = {
                friendProfileId: profileId,
                type: "post",
                postId: sharePostId,
                text: sendText
            };
        } else {
            message = {
                friendProfileId: profileId,
                text: sendText,
                type: "text",
                postId: null,
            };
        }

        socket.emit("sendMessage", message);

        setSendText("");
        setChatType("text");
        setSharePostId(null);
    };

    const handleChatBox = (profileId) => {
        socket.emit("closeChatBox", { profileId: profileId });
    }

    const renderFile = (fileUrl) => {
        if (!fileUrl) return null;
        const lower = fileUrl.toLowerCase();
        if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return <img src={fileUrl} className={styles.media} alt="post image" />;
        }
        if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm")) {
            return <video src={fileUrl} className={styles.media} muted loop playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => { e.target.pause(); }} />;
        }
        return <a href={fileUrl} target="_blank">Download File</a>;
    };
    const formatMessage = (text, type, postId, fileUrl) => {
        if (type === "post") {
            return <div
                // href={`/dashboard/post?url=${postId}`}
                style={{ color: "blue", textDecoration: "underline" }}
                onClick={() => {
                    setEditorOpen(true);
                    setMode("post");
                    setPostId(postId);
                }}>{renderFile(fileUrl)}{text}</div>
        } else {
            return text;
        }
    }
    const clearChat = async(profileId) => {
        try {
            const res = await fetch(`http://localhost:9876/clearChat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ profileId }),
            });

            const result = await res.json();
            if (!res.ok) {
                // console.log("res = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            // console.log("clear chat =:", result);
            setClearMsg(true);
            toast.success(result.message);
            // setClearMsg(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            {type === "single" ?
                <div ref={boxRef} handle=".info" className={styles.noDrag}>
                    <div className={styles.postCard} >
                        <div className={styles.postHeader} >
                            <div className={styles.info}>
                                <img
                                    src={profile.profilePhoto || "/loader.jpg"}
                                    alt={profile.username}
                                    className={styles.profileImage}
                                />
                                <div className={styles.postHeaderTime} onClick={() => {
                                    router.push(`/dashboard/profile?/${profile.username}`);
                                }}>
                                    <span className={styles.username}>{profile.username || "username"}</span>
                                    <span className={styles.postTime}>{lastSeen ? "Online" : "Offline"}</span>
                                </div>
                            </div>
                            <div className={styles.dots}>
                                <i className="fa-solid fa-broom" title="Clear chat" onClick={()=>clearChat(profile._id)}></i>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chatbody}>
                        <div className={styles.box}>
                            {history.length === 0 ? (
                                <p className={styles.empty}>No chat history found</p>
                            ) : (
                                history.map((h) => (
                                    <div key={h._id} className={styles.postCard}>
                                        <div className={styles.postHeaderMessage} >
                                            {(h.receiverId?._id || h.receiverId) === friendProfileId ?
                                                <div className={styles.containerReceiver}>
                                                    <div className={styles.infoReceiver}>
                                                        <div className={styles.postHeaderTime}>
                                                            <span className={styles.usernameReceiver} onClick={() => copyText(h.text)}>{formatMessage(h.text, h.type, h.postId?._id, h.postId?.fileUrl)}</span>
                                                            <span className={styles.postTimeReceiver}>
                                                                {formatDate(h.createdAt)} ago &nbsp;
                                                                {h.seen
                                                                    ? <i className="fa-solid fa-check-double" style={{ color: "var(--buttonColor)" }}></i>
                                                                    : <i className="fa-solid fa-check-double"></i>}</span>
                                                        </div>
                                                        <img
                                                            src={h.senderId?.profilePhoto || "/loader.png"}
                                                            alt={h.senderId.username}
                                                            className={styles.profileImageReceiver}
                                                        />
                                                    </div>
                                                </div> :
                                                <div className={styles.containerSender}>
                                                    <div className={styles.infoSender}>
                                                        <img
                                                            src={h.senderId?.profilePhoto || "/loader.png"}
                                                            alt={h.text}
                                                            className={styles.profileImageSender}
                                                        />
                                                        <div className={styles.postHeaderTime}>
                                                            <span className={styles.usernameSender} onClick={() => copyText(h.text)}>{formatMessage(h.text, h.type, h.postId?._id, h.postId?.fileUrl)}</span>
                                                            <span className={styles.postTimeSender}>
                                                                {/* {h.seen
                                                                    ? <i className="fa-solid fa-check-double" style={{ color: "var(--buttonColor)" }}></i>
                                                                    : <i className="fa-solid fa-check-double"></i>} | */}
                                                                {formatDate(h.createdAt)} ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div ref={bottomRef} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <section className={styles.suggestion}>
                        <span onClick={() => { setSendText(reply1) }}>{reply1}</span>
                        <span onClick={() => { setSendText(reply2) }}>{reply2}</span>
                        <span onClick={() => { setSendText(reply3) }}>{reply3}</span>
                    </section>
                    <form className={styles.textbox} onSubmit={sendMessage}>
                        <input type="text" placeholder="Write something" value={sendText} onChange={(e) => setSendText(e.target.value)} />
                        <input type="submit" value="➤" />
                    </form>
                </div> :
                <Draggable nodeRef={boxRef}>
                    <div ref={boxRef} handle=".info"
                        className={styles.drag}
                        style={{
                            zIndex: isMax ? 2 : 1,
                            ...layout,
                        }}
                    >
                        <div className={styles.header}>
                            <span><i className="fa-solid fa-grip" onClick={() => setLayout(POSITIONS[0])}></i></span>
                            <span>{isMax ? <i className="fa-solid fa-compress" onClick={() => setIsMax(false)}></i> :
                                <i className="fa-solid fa-expand" onClick={() => setIsMax(true)}></i>}</span>
                            <span><i className="fa-solid fa-xmark" onClick={() => handleChatBox(profile._id)}></i></span>
                        </div>
                        <ResizableBox
                            width={width}
                            height={height}
                            minConstraints={[300, 300]}
                            maxConstraints={screen}
                            resizeHandles={["se", "sw", "ne", "nw", "e", "w", "n", "s"]}
                            className={styles.resize}>

                            <div className={styles.postCard} >
                                <div className={styles.postHeader} >
                                    <div className={styles.info}>
                                        <img
                                            src={profile.profilePhoto || "/loader.jpg"}
                                            alt={profile.username}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.postHeaderTime} onClick={() => {
                                            router.push(`/dashboard/profile?/${profile.username}`);
                                        }}>
                                            <span className={styles.username}>{profile.username || "username"}</span>
                                            <span className={styles.postTime}>{lastSeen ? "Online" : "Offline"}</span>
                                        </div>
                                    </div>
                                    <div className={styles.dots}>
                                        <i className="fa-solid fa-broom" title="Clear chat" onClick={()=>clearChat(profile._id)}></i>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.chatbody}>
                                <div className={styles.box}>
                                    {history.length === 0 ? (
                                        <p className={styles.empty}>No chat history found</p>
                                    ) : (
                                        history.map((h) => (
                                            <div key={h._id} className={styles.postCard}>
                                                <div className={styles.postHeaderMessage} >
                                                    {(h.receiverId?._id || h.receiverId) === friendProfileId ?
                                                        <div className={styles.containerReceiver}>
                                                            <div className={styles.infoReceiver}>
                                                                <div className={styles.postHeaderTime}>
                                                                    <span className={styles.usernameReceiver} onClick={() => copyText(h.text)}>{formatMessage(h.text, h.type, h.postId?._id, h.postId?.fileUrl)}</span>
                                                                    <span className={styles.postTimeReceiver}>
                                                                        {formatDate(h.createdAt)} ago &nbsp;
                                                                        {h.seen
                                                                            ? <i className="fa-solid fa-check-double" style={{ color: "var(--buttonColor)" }}></i>
                                                                            : <i className="fa-solid fa-check-double"></i>}</span>
                                                                </div>
                                                                <img
                                                                    src={h.senderId?.profilePhoto || "/loader.png"}
                                                                    alt={h.senderId.username}
                                                                    className={styles.profileImageReceiver}
                                                                />
                                                            </div>
                                                        </div> :
                                                        <div className={styles.containerSender}>
                                                            <div className={styles.infoSender}>
                                                                <img
                                                                    src={h.senderId?.profilePhoto || "/loader.png"}
                                                                    alt={h.text}
                                                                    className={styles.profileImageSender}
                                                                />
                                                                <div className={styles.postHeaderTime}>
                                                                    <span className={styles.usernameSender} onClick={() => copyText(h.text)}>{formatMessage(h.text, h.type, h.postId?._id, h.postId?.fileUrl)}</span>
                                                                    <span className={styles.postTimeSender}>
                                                                        {/* {h.seen
                                                                    ? <i className="fa-solid fa-check-double" style={{ color: "var(--buttonColor)" }}></i>
                                                                    : <i className="fa-solid fa-check-double"></i>} | */}
                                                                        {formatDate(h.createdAt)} ago</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div ref={bottomRef} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <section className={styles.suggestion}>
                                <span onClick={() => { setSendText(reply1) }}>{reply1}</span>
                                <span onClick={() => { setSendText(reply2) }}>{reply2}</span>
                                <span onClick={() => { setSendText(reply3) }}>{reply3}</span>
                            </section>
                            <form className={styles.textbox} onSubmit={sendMessage}>
                                <input type="text" placeholder="Write something" value={sendText} onChange={(e) => setSendText(e.target.value)} />
                                <input type="submit" value="➤" />
                            </form>
                        </ResizableBox>
                    </div>
                </Draggable>}
            {editorOpen === true
                ? <div className={styles.profileUpdate} >

                    {mode === "post" ?
                        <Post postId={postId} userId={userId}
                            onClose={() => setEditorOpen(false)}
                        /> : ""}
                </div>
                : ""}
        </>
    );
}
