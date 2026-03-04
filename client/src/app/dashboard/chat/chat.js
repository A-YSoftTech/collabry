"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "../../../styles/dashboard/chat/page.module.css";

import getSocket from "@/app/context/getSocket";
import ChatBox from "./chatBox";
import { AppContext } from "@/app/context/appProvider";
export default function Chat() {
    const router = useRouter();
    const leftRef = useRef(null);
    const [openBox, setOpenBox] = useState(true);
    const [profileId, setProfileId] = useState(null);
    const [sendList, setSendList] = useState([]);
    const [receiveList, setReceivelist] = useState([]);

    const { chatRequest, chatNotification } = useContext(AppContext);

    if (!chatRequest) {
        return <main className={styles.containerBox}>Loading chats...</main>
    }

    const friendChatList = async () => {
        try {
            const response = await fetch("http://localhost:9876/chat", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            const data = await response.json();
            if (!response.ok) {
                console.log("Error is :", data.token);
                if (data.token === false) {
                    router.push("/");
                }
                toast.error(data.message);
                return;
            }
            setReceivelist(data.receiver);
            setSendList(data.sender);
        } catch (error) {
            console.error("chat error:", error);
            toast.error(error.message);
        }
    }
    const singleChatBox = async () => {
        try {
            const response = await fetch("http://localhost:9876/singleChatBox", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            const data = await response.json();
            if (!response.ok) {
                console.log("Error is :", data.token);
                if (data.token === false) {
                    router.push("/");
                }
                toast.error(data.message);
                return;
            }
            console.log("singlechatbox = ", data);
            setProfileId(data.chatbox.activeProfileId)
        } catch (error) {
            console.error("chat error:", error);
            toast.error(error.message);
        }
    }
    useEffect(() => {
        friendChatList();
        singleChatBox();
    }, []);
    useEffect(() => {
        if (chatRequest) {
            chatNotification();
        }
    }, [profileId])
    const handleSwipe = () => {
        leftRef.current?.scrollIntoView({ behavior: "smooth", transition: "1s" });
    };
    const openSingleChat = async (profileId) => {
        try {
            const response = await fetch("http://localhost:9876/openSingleChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ profileId })
            })
            const data = await response.json();
            if (!response.ok) {
                console.log("Error is :", data.token);
                if (data.token === false) {
                    router.push("/");
                }
                toast.error(data.message);
                return;
            }
            console.log("open = ", data);
            setOpenBox(true);
            // toast.success(data.message);
        } catch (error) {
            console.error("chat error:", error);
            toast.error(error.message);
        }
    }
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

    const socket = getSocket();
    const handleChatBox = (profile) => {
        socket.emit("openChatBox", {
            profileId: profile
        })
    }

    return (
        <main className={styles.containerBox}>
            <section className={styles.chatList}>
                <div className={styles.header}>
                    <h1>Chats</h1>
                    <form>
                        <input type="text" placeholder="Search" />
                        <p>x</p>
                    </form>
                </div>
                <div className={styles.box}>
                    {/* <h1>Chat message</h1> */}
                    {chatRequest.length === 0 ? (
                        ""
                    ) : (
                        chatRequest.map((r) => (
                            <div key={r._id} className={styles.postCard}>
                                <div className={styles.postHeader} >
                                    <div className={styles.info} onClick={() => {

                                        setProfileId(r.senderId._id);
                                        openSingleChat(r.senderId._id);
                                        handleSwipe();
                                        chatNotification();
                                    }}>
                                        <img
                                            src={r.senderId.profilePhoto || "/loader.png"}
                                            alt={r.senderId.username}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.postHeaderTime}>
                                            <span className={styles.username}>{r.senderId.username}</span>
                                            <span className={styles.postTime}>
                                                {r.seen
                                                    ? <i className="fa-solid fa-check-double" style={{ color: "var(--buttonColor)" }}></i>
                                                    : <i className="fa-solid fa-check-double"></i>} &nbsp;
                                                {r.text}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.dots}>
                                        <small>{formatDate(r.createdAt)} ago</small>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className={styles.box}>
                    {/* <h1>Your Collaboration</h1> */}
                    {sendList.length === 0 ? (
                        ""
                    ) : (
                        sendList.map((r) => (
                            <div key={r._id} className={styles.postCard}>
                                <div className={styles.postHeader} >
                                    <div className={styles.info} onClick={() => {
                                        openSingleChat(r.userProfileId._id);
                                        setProfileId(r.userProfileId._id);
                                        handleSwipe();
                                        chatNotification();
                                    }}>
                                        <img
                                            src={r.userProfileId.profilePhoto || "/loader.png"}
                                            alt={r.userProfileId.username}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.postHeaderTime}>
                                            <span className={styles.username}>{r.userProfileId.username}</span>
                                            <span className={styles.postTime}>{r.userProfileId.isOnline ? "Online" : "last seen " + (formatDate(r.userProfileId.updatedAt)) + " ago"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {receiveList.length === 0 ? (
                        ""
                    ) : (
                        receiveList.map((r) => (
                            <div key={r._id} className={styles.postCard}>
                                <div className={styles.postHeader} >
                                    <div className={styles.info} onClick={() => {
                                        openSingleChat(r.ownerProfileId._id);
                                        setProfileId(r.ownerProfileId._id);
                                        handleSwipe();
                                    }}>
                                        <img
                                            src={r.ownerProfileId.profilePhoto || "/loader.png"}
                                            alt={r.ownerProfileId.username}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.postHeaderTime}>
                                            <span className={styles.username}>{r.ownerProfileId.username}</span>
                                            <span className={styles.postTime}>{r.ownerProfileId.isOnline ? "Online" : "last seen " + formatDate(r.ownerProfileId.updatedAt) + " ago"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ section>
            <section className={styles.chatContent} ref={leftRef}>
                <span className={styles.noChat}>
                    <i className="fa-solid fa-comment-slash"></i><br />
                    <p>No chat found</p>
                </span>
                {openBox ?
                    <ChatBox
                        profileId={profileId}
                        type={"single"}
                    /> : ""}
            </section>
        </main>
    );
}
