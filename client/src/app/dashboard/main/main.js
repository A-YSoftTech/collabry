"use client"
import styles from "../../../styles/dashboard/main/page.module.css"
import { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import MainsEditor from "./mainEditor";
import getSocket from "@/app/context/getSocket";
import Notification from "../notification/notification";
import Search from "../search/search";
import { AppContext } from "@/app/context/appProvider";
import Chat from "../chat/chat";
import Status from "../status/status";
import Message from "../friend/message";

export default function Mains() {

    const { owner, loading, relationship, acceptRequest, sendFriendRequest, setChatType, sharePostId, setSharePostId, chatRequest, chatNotification } = useContext(AppContext);
    const userId = owner?.userId;

    const router = useRouter();

    const leftRef = useRef(null);
    const rightRef = useRef(null);


    const [expandedPostId, setExpandedPostId] = useState(null);

    const [isMax, setIsMax] = useState(false);
    const [screen, setScreen] = useState([400, 600]);
    const [mode, setMode] = useState("profile");
    const [postID, setPostID] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);
    const [post, setPost] = useState([]);
    const [savedPost, setSavedPost] = useState([]);
    const [openMsgBox, setOpenMsgBox] = useState(false);
    const [likeCount, setLikeCount] = useState("0");

    // const [profileId, setProfileId] = useState(null);
    // const [sendList, setSendList] = useState([]);
    // const [receiveList, setReceivelist] = useState([]);

    // const { chatRequest, chatNotification } = useContext(AppContext);

    if (!chatRequest) {
        return <main className={styles.containerBox}>Loading chats...</main>
    }

    // const friendChatList = async () => {
    //     try {
    //         const response = await fetch("http://localhost:9876/chat", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",
    //         })
    //         const data = await response.json();
    //         if (!response.ok) {
    //             console.log("Error is :", data.token);
    //             if (data.token === false) {
    //                 router.push("/");
    //             }
    //             toast.error(data.message);
    //             return;
    //         }
    //         setReceivelist(data.receiver);
    //         setSendList(data.sender);
    //     } catch (error) {
    //         console.error("chat error:", error);
    //         toast.error(error.message);
    //     }
    // }
    const fetchPost = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/getAllPost`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const result = await res.json();
            if (!res.ok) {
                console.log("res = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            console.log("console =", result);
            // setLikeCount("0");
            setSavedPost(result.savedPost);
            setPost(result.posts);
        } catch (error) {
            toast.error(error.message);
        }
    };
    useEffect(() => {
        fetchPost();
    }, []);

    const saveScreenSize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setScreen([w, h]);
        console.log("w,h=", w, h);
    }
    if (loading) {
        return <main className={styles.containerBox}><b>Loading in process...</b></main>;
    }
    const getStatus = (userId) => {

        const status = relationship[userId] || acceptRequest[userId];

        if (status === "pending")
            return <p style={{ color: "grey" }} onClick={() => router.push(`/dashboard/notification`)}>Pending...</p>;

        if (status === "friend")
            return <p style={{ color: "#7C3AED" }}>Collabed</p>;

        return <span onClick={() => sendFriendRequest(userId)}>Collab</span>;
    };

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
    const handleSwipe = (value) => {
        if (value === "left") {
            leftRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
            rightRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };
    const renderFile = (fileUrl) => {
        if (!fileUrl) return null;
        const lower = fileUrl.toLowerCase();

        // ------ IMAGE ------
        if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return <img src={fileUrl} className={styles.media} alt="post image" />;
        }

        // ------ VIDEO ------
        if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm")) {
            return <video src={fileUrl} className={styles.media} muted loop playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => { e.target.pause(); }} />;
        }

        // ------ UNKNOWN ------
        return <a href={fileUrl} target="_blank">Download File</a>;
    };
    const likePost = async (postId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/likePost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postId }),
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
            console.log("Like post data:", data);
            setLikeCount(data.likesCount);
            fetchPost();
        } catch (error) {
            console.error("Like post error:", error);
            toast.error(error.message);
        }
    };
    const savePost = async (postId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/savePost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postId }),
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
            // console.log("save post data:", data);
            // setLikeCount(data.likesCount);
            fetchPost();
        } catch (error) {
            console.error("Like post error:", error);
            toast.error(error.message);
        }
    };
    const rePost = async (postId) => {
        console.log("repostid = ", postId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/repost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postId }),
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
            console.log("repost data:", data);
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    const sharePost = async (postId) => {
        try {
            const url = `http://localhost:3000/dashboard/post?url=${postId}`;
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            toast.error("Something went wrong!")
        }
    };
    const report = async (postId) => {
        console.log("reportid = ", postId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postId }),
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
            // console.log("report data:", data);
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    const socket = getSocket();
    const handleChatBox = (profile) => {
        socket.emit("openChatBox", {
            profileId: profile
        });
    };
    const filterPost = post.filter(f => {
        return f.profileId?.status === "public" && f.type === "post" && f.userId != userId;
    });
    const filterRepost = post.filter(f => {
        return f.originalPostId?.profileId?.status === "public" && f.type === "repost" && f.userId != userId;
    });
    return (
        <main className={styles.containerBox}>
            <section className={styles.container} ref={rightRef}>
                <div className={styles.poster}>
                    <span className={styles.posterImage}>
                        <img src="/logo.png" alt="logo" />
                        <p>Collabry</p>
                    </span>
                    <i className="fa-solid fa-bell" onClick={() =>
                        router.push("/dashboard/notification")
                    }></i>
                </div>
                <div className={styles.header}>
                    <Status />
                </div>
                <div className={styles.box} >
                    {filterPost.length === 0 ? (
                        <p className={styles.empty}>No posts found</p>
                    ) : (
                        filterPost.map((p) => (
                            <div key={p._id} className={styles.postCard} >
                                {/* Header */}
                                <div className={styles.postHeader} >
                                    <div className={styles.info} onClick={() => {
                                        router.push(`/dashboard/profile/${p.profileId.username}`)
                                    }}>
                                        <img
                                            src={p.profileId.profilePhoto || "/loader.png"}
                                            alt={p.profileId.username}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.postHeaderTime}>
                                            <span className={styles.username}>{p.profileId.username}</span>
                                            <span className={styles.postTime}>{p.profileId.fullname} | {formatDate(p.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.dots}>
                                        {getStatus(p.userId)}
                                        <i className="fa-regular fa-paper-plane" onClick={() => {
                                            sharePost(p._id);
                                            setOpenMsgBox(true);
                                            setChatType("post");
                                            setSharePostId(p._id);
                                        }}></i>
                                        <i className="fa-solid fa-flag" onClick={()=>report(p._id)}></i>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className={styles.caption}>
                                    <div className={styles.file}>
                                        {renderFile(p.fileUrl)}
                                    </div>
                                    <p className={styles.fileText} style={
                                        expandedPostId === p._id
                                            ? { whiteSpace: "normal" }
                                            : { whiteSpace: "nowrap", overflow: "hidden" }
                                    }>{p.caption}</p>
                                    <strong onClick={() => setExpandedPostId(expandedPostId === p._id ? null : p._id)}>
                                        {expandedPostId === p._id ? "less" : "more"}
                                    </strong>
                                </div>

                                {/* Actions (like, comment, share) */}
                                <div className={styles.postActions}>
                                    <span className={styles.actionBtn}>
                                        <p onClick={() => likePost(p._id)}>
                                            {p.likes.includes(userId)
                                                ? <i className="fa-solid fa-heart" style={{ color: "var(--buttonColor)" }}></i>
                                                : <i className="fa-regular fa-heart"></i>}
                                            {p.likes.length}
                                        </p>


                                        <p onClick={() => {
                                            setPostID(p._id);
                                            setEditorOpen(true);
                                            setMode("Comment");
                                            handleSwipe("left");
                                        }}>
                                            {p.comments.includes(userId)
                                                ? <i className="fa-solid fa-comment" style={{ color: "var(--buttonColor)" }}></i>
                                                : <i className="fa-regular fa-comment"></i>}
                                            {p.comments.length}
                                        </p>


                                        <p onClick={() => rePost(p._id)}><i className="fa-solid fa-retweet"></i></p>
                                    </span>
                                    <span>
                                        <p onClick={() => savePost(p._id)}>
                                            {savedPost.includes(p._id)
                                                ? <i className="fa-solid fa-bookmark" style={{ color: "var(--buttonColor)" }}></i>
                                                : <i className="fa-regular fa-bookmark"></i>}
                                        </p>
                                    </span>
                                </div>
                            </div>

                        ))
                    )}
                </div>
                {/* repost */}
                <div className={styles.box} >
                    {filterRepost.length === 0 ? (
                        ""
                    ) : (
                        filterRepost.map((p) => (
                            <div key={p._id} className={styles.postCard} >
                                {/* Header */}
                                <div className={styles.postHeader} >
                                    <div className={styles.info} onClick={() => {
                                        router.push(`/dashboard/profile/${p.profileId?.username}`)
                                    }}>
                                        <img
                                            src={p.profileId?.profilePhoto || "/loader.png"}
                                            alt={p.profileId?.username}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.postHeaderTime}>
                                            <span className={styles.username}>{p.profileId?.username} | <small>Reposted</small></span>
                                            <span className={styles.postTime}>{p.profileId?.fullname} | {formatDate(p.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.dots}>
                                        {getStatus(p.userId)}
                                        <i className="fa-regular fa-paper-plane" onClick={() => {
                                            sharePost(p._id);
                                            setOpenMsgBox(true);
                                            setChatType("post");
                                            setSharePostId(p._id);
                                        }}></i>
                                        {/* <small>repost</small> */}
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className={styles.caption}>
                                    <div className={styles.postHeader}>
                                        <div className={styles.info} onClick={() => {
                                            router.push(`/dashboard/profile/${p.originalPostId?.profileId?.username}`)
                                        }} >
                                            <img
                                                src={p.originalPostId?.profileId?.profilePhoto || "/loader.png"}
                                                alt={p.originalPostId?.profileId?.username}
                                                className={styles.profileImage}
                                            />
                                            <div className={styles.postHeaderTime}>
                                                <span className={styles.username}>{p.originalPostId?.profileId?.username}</span>
                                                <span className={styles.postTime}>{p.originalPostId?.profileId?.fullname} | {formatDate(p.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.dots}>
                                            {getStatus(p.originalPostId?.userId)}
                                            <i className="fa-regular fa-paper-plane" onClick={() => {
                                                sharePost(p.originalPostId?._id);
                                                setOpenMsgBox(true);
                                                setChatType("post");
                                                setSharePostId(p.originalPostId?._id);
                                            }}></i>
                                        </div>
                                    </div>
                                    <div className={styles.file}>
                                        {renderFile(p.originalPostId?.fileUrl)}
                                    </div>
                                    <p className={styles.fileText} style={
                                        expandedPostId === p._id
                                            ? { whiteSpace: "normal" }
                                            : { whiteSpace: "nowrap", overflow: "hidden" }
                                    }>{p.originalPostId?.caption}</p>
                                    <strong onClick={() => setExpandedPostId(expandedPostId === p._id ? null : p._id)}>
                                        {expandedPostId === p._id ? "less" : "more"}
                                    </strong>
                                </div>

                                {/* Actions (like, comment, share) */}
                                <div className={styles.postActions}>
                                    <span className={styles.actionBtn}>
                                        <p onClick={() => likePost(p._id)}>
                                            {p.likes.includes(userId)
                                                ? <i className="fa-solid fa-heart" style={{ color: "var(--buttonColor)" }}></i>
                                                : <i className="fa-regular fa-heart"></i>}
                                            {p.likes.length}
                                        </p>


                                        <p onClick={() => {
                                            setPostID(p._id);
                                            setEditorOpen(true);
                                            setMode("Comment");
                                            handleSwipe("left");
                                        }}>
                                            {p.comments.includes(userId)
                                                ? <i className="fa-solid fa-comment" style={{ color: "var(--buttonColor)" }}></i>
                                                : <i className="fa-regular fa-comment"></i>}
                                            {p.comments.length}
                                        </p>


                                        <p onClick={() => rePost(p.originalPostId?._id)}><i className="fa-solid fa-retweet"></i></p>
                                    </span>
                                    <span>
                                        <p onClick={() => savePost(p._id)}>
                                            {savedPost.includes(p._id)
                                                ? <i className="fa-solid fa-bookmark" style={{ color: "var(--buttonColor)" }}></i>
                                                : <i className="fa-regular fa-bookmark"></i>}
                                        </p>
                                    </span>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </section>
            <section className={styles.helpbox} ref={leftRef}>
                <div className={styles.suggestion}>
                    <Search />
                </div>
                {openMsgBox ?
                    <div className={styles.chatList} style={{ width: `${screen[0]}px`, height: `${screen[1]}px` }}>
                        <span className={styles.chatHeader}>
                            <h1>Messages</h1>
                            <span className={styles.maxMin}>
                                {isMax
                                    ? <i className="fa-solid fa-compress" onClick={() => { setScreen([400, 600]); setIsMax(false) }}></i>
                                    : <i className="fa-solid fa-expand" onClick={() => { saveScreenSize(); setIsMax(true) }}></i>
                                }
                                <i className="fa-solid fa-x" onClick={() => setOpenMsgBox(false)}></i>
                            </span>
                        </span>
                        <div className={styles.friends}>
                            {/* <Chat /> */}
                            <Message />
                        </div>
                    </div> : ""}
                <div className={styles.messageBox} onClick={() => {
                    setOpenMsgBox(true);
                    // friendChatList();
                }}>
                    <span>Messages</span>
                    <i className="fa-regular fa-paper-plane"></i>
                </div>
                {editorOpen === true
                    ? <div className={styles.commentbox} >
                        <MainsEditor
                            mode={mode}
                            postId={postID}
                            onUpdate={() => { fetchPost() }}
                            onClose={() => {
                                handleSwipe("right")
                                setEditorOpen(false);
                            }} />
                    </div>
                    : ""}
            </section>


        </main>
    );
}

