"use client"
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/context/appProvider";
import styles from "../../../styles/dashboard/friend/page.module.css"

export default function Friend({friendId, onClose}) {
    const router = useRouter();
    const { owner, relationship, acceptRequest, sendFriendRequest } = useContext(AppContext);
    const userId = owner?.userId;
    
    const [sendList, setSendList] = useState([]);
    const [receiveList, setReceivelist] = useState([]);
    useEffect(() => {
        const friendChat = async (friendId) => {
            try {
                const response = await fetch("http://localhost:9876/friendCollaboration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({friendId})
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
                // console.log("chat:", data);
                setReceivelist(data.receiver);
                setSendList(data.sender);
            } catch (error) {
                console.error("chat error:", error);
                toast.error(error.message);
            }
        }
        friendChat(friendId);
    }, []);
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
    const getStatus = (userId, friendId) => {

        const status = relationship[userId] || acceptRequest[userId];

        if (status === "pending")
            return <p style={{ color: "grey" }} onClick={() => router.push(`/dashboard/notification`)}>Pending...</p>;

        if (status === "friend")
            return <p style={{ color: "#7C3AED" }}>Collabed</p>;

        return <span onClick={() => sendFriendRequest(friendId)}>Collab</span>;
    };
    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>Your collaboration</h1>
                <p onClick={onClose}>x</p>
            </div>
            <div className={styles.box}>
                {sendList.length == 0 ? (
                    ""
                ) : (
                    sendList.map((r) => (
                        <div key={r._id} className={styles.postCard}>
                            <div className={styles.postHeader} >
                                <div className={styles.info} onClick={() => {
                                    router.push(`/dashboard/profile/${r.userProfileId.username}`);
                                }}>
                                    <img
                                        src={r.userProfileId.profilePhoto || "/loader.png"}
                                        alt={r.userProfileId.username}
                                        className={styles.profileImage}
                                    />
                                    <div className={styles.postHeaderTime}>
                                        <span className={styles.username}>{r.userProfileId.username}</span>
                                        <span className={styles.postTime}>{r.userProfileId.fullname}</span>
                                    </div>
                                </div>
                                <div className={styles.dots}>
                                    {getStatus(userId, r.userId)}
                                    {/* <i className="fa-solid fa-paper-plane" onClick={() => handleChatBox(r.userProfileId._id)}></i> */}
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
                                    router.push(`/dashboard/profile/${r.ownerProfileId.username}`);
                                }}>
                                    <img
                                        src={r.ownerProfileId.profilePhoto || "/loader.png"}
                                        alt={r.ownerProfileId.username}
                                        className={styles.profileImage}
                                    />
                                    <div className={styles.postHeaderTime}>
                                        <span className={styles.username}>{r.ownerProfileId.username}</span>
                                        <span className={styles.postTime}>{r.ownerProfileId.fullname}</span>
                                    </div>
                                </div>
                                <div className={styles.dots}>
                                    {getStatus(userId, r.ownerId)}
                                    {/* <i className="fa-brands fa-rocketchat" onClick={() => handleChatBox(r.ownerProfileId._id)}></i> */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
