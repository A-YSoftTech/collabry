
"use client";
import { useEffect, useState } from "react";
import styles from "../../../styles/admin/adminProfileEdit/page.module.css"
import { toast } from "react-toastify";

export default function AdminProfileEdit({ userId, onClose }) {

    const [userdetail, setUserdetail] = useState();
    const userDetails = async (userId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/adminGetProfile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userId })
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
            // console.log("userid data:", data);
            setUserdetail(data.response);
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    useEffect(() => {
        userDetails(userId);
    }, [])
    const onBlock = async (blockId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/blockUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ blockId })
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
            userDetails(userId);
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    const onDelete = async (deleteId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/deleteUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ deleteId })
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
            // console.log("deleteid data:", data);
            onClose();
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    const onAdmin = async (userId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/makeAdmin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userId })
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
            // console.log("admin data:", data);
            onClose();
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
        return date.toLocaleDateString();
    };
    return (
        <main className={styles.bucket}>
            <div className={styles.container}>

                <div className={styles.header}>
                    <img
                        src={userdetail?.profilePhoto}
                        alt="Profile Photo"
                        className={styles.avatar}
                    />
                    <div>
                        <h2 className={styles.username}>{userdetail ? userdetail.username : "Loading..."}</h2>
                        <p className={styles.fullname}>{userdetail ? userdetail.fullname : "Loading..."}</p>
                        <p className={styles.fullname}>{userdetail ? userdetail.gender : "Loading..."}</p>
                    </div>
                </div>

                <div className={styles.bio}>
                    <p>{userdetail ? userdetail.bio : "Loading..."}</p>
                </div>

                {/* <div className={styles.stats}>
                    <p><strong>postCount</strong> Posts</p>
                    <p><strong>collaboration</strong> Collaboration</p>
                </div> */}

                <div className={styles.status}>
                    <p>Profile Id: {userdetail?._id}</p>
                    <p>Account: {userdetail?.status === "public" ?
                        <span style={{ color: "green" }}>{userdetail?.status}</span> :
                        <span style={{ color: "red" }}>{userdetail?.status}</span>}</p>
                    <p>Location: {userdetail ? userdetail.location : "Loading..."}</p>
                    <p>Status: {userdetail?.isOnline ?
                        <span style={{ color: "green" }}>Online</span> :
                        <span style={{ color: "red" }}>Offline</span>}</p>
                    <p>Email: {userdetail?.userId?.email}</p>
                    <p>Phone: {userdetail?.userId?.phone}</p>
                    <p>Role: {userdetail?.userId?.role}</p>
                    <p>Vibe: {userdetail?.vibe}</p>

                    <div>Friends:

                        {userdetail?.friends && userdetail.friends.length > 0 ? (
                            <ul>
                                {userdetail.friends.map((friendId, index) => (
                                    <li key={friendId || index}>
                                        &nbsp;&nbsp; -{friendId}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <i>&nbsp; No friends</i>
                        )}
                    </div>
                    <p>Last seen: {userdetail ? formatDate(userdetail.updatedAt) : "Loading..."}</p>
                    <div>Liked Post:

                        {userdetail?.sharedPost && userdetail.sharedPost.length > 0 ? (
                            <ul>
                                {userdetail.sharedPost.map((postId, index) => (
                                    <li key={postId || index}>
                                        &nbsp;&nbsp;- {postId}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <i>&nbsp; No post</i>
                        )}
                    </div>
                    <p>Created At: {userdetail ? formatDate(userdetail.createdAt) : "Loading..."}</p>
                    <div>Shaved Post:

                        {userdetail?.savedPost && userdetail.savedPost.length > 0 ? (
                            <ul>
                                {userdetail.savedPost.map((postId, index) => (
                                    <li key={postId || index}>
                                        &nbsp;&nbsp;- {postId}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <i>&nbsp; No post</i>
                        )}
                    </div>
                </div>

                <div className={styles.social}>
                    <p>Social Links</p>
                    <ul>
                        <li><i className="fa-brands fa-instagram"></i><a href={userdetail ? userdetail.instagram : "Loading..."}>Instagram</a></li>
                        <li><i className="fa-brands fa-twitter"></i><a href={userdetail ? userdetail.twitter : "Loading..."}>Twitter</a></li>
                        <li><i className="fa-brands fa-youtube"></i><a href={userdetail ? userdetail.youtube : "Loading..."}>YouTube</a></li>
                        <li><i className="fa-brands fa-linkedin"></i><a href={userdetail ? userdetail.linkedin : "Loading..."}>LinkedIn</a></li>
                    </ul>
                </div>
                <div className={styles.actions}>
                    <button className={styles.follow} onClick={()=>onBlock(userdetail?.userId?._id)}>
                        {userdetail?.userId?.role === "block"? "Unblock" : "block"}
                    </button>
                    <button className={styles.follow} onClick={()=>onAdmin(userdetail?.userId?._id)}>
                        {userdetail?.userId?.role === "user"? "admin" : "user"}
                    </button>
                    <button className={styles.message} onClick={()=>onDelete(userdetail?.userId?._id)}>Delete</button>
                </div>

            </div>
            <p className={styles.cross} onClick={() => onClose()}>x</p>
        </main>
    );
}
