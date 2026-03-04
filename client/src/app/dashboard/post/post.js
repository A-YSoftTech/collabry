"use client"
import { useState, useEffect, useContext } from "react";
import styles from "../../../styles/dashboard/post/page.module.css"
import PostEditor from "./postEditor";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { AppContext } from "@/app/context/appProvider";
import MainsEditor from "../main/mainEditor";

export default function Post({ postId, onClose, userId }) {
    const searchParams = useSearchParams();
    const url = searchParams.get("url");
    console.log("post url = ", url)
    const { owner, loading, relationship, acceptRequest, sendFriendRequest } = useContext(AppContext);
    const router = useRouter();
    const [ownerId, setOwnerId] = useState("");
    const [mode, setMode] = useState("profile");
    const [postID, setPostID] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);
    const [post, setPost] = useState([]);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [savedPost, setSavedPost] = useState([]);
    console.log("post&userid = ", postId, userId);
    const fetchPost = async (postId) => {
        try {
            const res = await fetch(`http://localhost:9876/openPost`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ postId }),
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

            console.log("post =:", result);
            // setOwnerId(result.ownerId);
            setPost(result.postDetail);
            setSavedPost(result.myProfile.savedPost)
            // toast.success("Fetched all post!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const whichId = postId || url;
        fetchPost(whichId);
    }, []);
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
            fetchPost(postId);
        } catch (error) {
            console.error("Like post error:", error);
            toast.error(error.message);
        }
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
            fetchPost(postId);
        } catch (error) {
            console.error("Like post error:", error);
            toast.error(error.message);
        }
    };
    const sharePost = async (postId) => {
        try {
            const url = `http://localhost:3000/dashboard/post?userId=${postId}`;
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }
    return (
        <main className={styles.containerBox}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Post</h1>
                    <p onClick={onClose}>x</p>
                </div>
                <div className={styles.box} >
                    <div key={post._id} className={styles.postCard} >

                        <div className={styles.postHeader} >
                            <div className={styles.info} onClick={() => {
                                router.push(`/dashboard/profile/${post.profileId?.username}`);
                            }}>
                                <img
                                    src={post.profileId?.profilePhoto || "/loader.png"}
                                    alt={post.profileId?.username}
                                    className={styles.profileImage}
                                />
                                <div className={styles.postHeaderTime}>
                                    <span className={styles.username}>{post.profileId?.username}</span>
                                    <span className={styles.postTime}>{post.profileId?.fullname} | {formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                            {post.userId == userId ?
                                <div className={styles.dots}>
                                    <span onClick={() => {
                                        setPostID(post._id);
                                        setEditorOpen(true);
                                        setMode("Update");
                                    }}>Edit</span>
                                    <i className="fa-solid fa-trash-can" onClick={() => {
                                        setPostID(post._id);
                                        setEditorOpen(true);
                                        setMode("Delete");
                                    }}></i>
                                </div> :
                                <div className={styles.dots}>
                                    {getStatus(post.userId)}
                                </div>}
                        </div>


                        <div className={styles.caption}>
                            <div className={styles.file}>
                                {renderFile(post.fileUrl)}
                            </div>
                            <p className={styles.fileText} style={
                                expandedPostId === post._id
                                    ? { whiteSpace: "normal" }
                                    : { whiteSpace: "nowrap", overflow: "hidden" }
                            }>{post.caption}</p>
                            <strong onClick={() => setExpandedPostId(expandedPostId === post._id ? null : post._id)}>
                                {expandedPostId === post._id ? "less" : "more"}
                            </strong>
                        </div>

                        <div className={styles.postActions}>
                            <span className={styles.actionBtn}>
                                <p onClick={() => likePost(post._id)}>
                                    {post.likes?.includes(userId)
                                        ? <i className="fa-solid fa-heart" style={{ color: "var(--buttonColor)" }}></i>
                                        : <i className="fa-regular fa-heart"></i>}
                                    {post.likes?.length}
                                </p>
                                <p onClick={() => {
                                    setPostID(post._id);
                                    setEditorOpen(true);
                                    setMode("Comment");
                                }}><i className="fa-regular fa-comment"></i>{post.comments?.length}</p>
                                <p onClick={() => sharePost(post.userId)}><i className="fa-solid fa-retweet"></i></p>
                            </span>
                            <span>
                                <p onClick={() => savePost(post._id)}>
                                    {savedPost.includes(post._id)
                                        ? <i className="fa-solid fa-bookmark" style={{ color: "var(--buttonColor)" }}></i>
                                        : <i className="fa-regular fa-bookmark"></i>}
                                </p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {editorOpen === true ?
                <div className={styles.commentBox}>
                    {mode === "Comment" ?
                        <MainsEditor
                            mode={mode}
                            postId={postID}
                            onUpdate={() => {
                                fetchPost(postId);
                            }}
                            onClose={() => {
                                setEditorOpen(false);
                            }} /> :
                        <PostEditor
                            mode={mode}
                            postId={postID}
                            onUpdate={() => {
                                fetchPost(postId);
                            }}
                            onClose={() => {
                                setEditorOpen(false);
                            }} />}
                </div> : ""}

        </main>
    );
}
