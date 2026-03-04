
"use client"
import { useContext, useEffect, useRef, useState } from "react";
import styles from "../../../styles/dashboard/profile/page.module.css"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/context/appProvider";
import ProfileUpdate from "./profileUpdate";
import Post from "../post/post";
import Friend from "../friend/friend";

export default function Profile() {
    const router = useRouter();
    const postRef = useRef();
    const likeRef = useRef();
    const { owner, loading } = useContext(AppContext);
    const [userdetail, setUserdetail] = useState(null);
    const [savePost, setSavePost] = useState([]);
    const [sharedPost, setSharedPost] = useState([]);
    const [myPost, setMyPost] = useState([]);
    
    
    
    const [mode, setMode] = useState("");
    const [postId, setPostId] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);

    const userId = owner?.userId;
    // console.log("context profile = ", userId);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/userProfile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
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
            console.log("profile log=", data)
            setSavePost(data.response.savedPost);
            setSharedPost(data.response.sharedPost);
            setUserdetail(data.response);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.message);
        }
    }
    const myPosts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/getPost`, {
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
            // console.log("myPost data:", data);
            setMyPost(data.posts);
            // toast.success(data.message);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.message);
        }
    }
    const handleSwipe = (value) => {
        if (value === "post") {
            postRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
            likeRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };
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
    useEffect(() => {
        fetchData();
        myPosts();
    }, []);

    // ✅ Conditional rendering only affects return
    if (loading) {
        return <main className={styles.bucket}>Loading...</main>;
    }

    if (!owner) {
        return <main className={styles.bucket}>No owner data</main>;
    }

    return (
        <main className={styles.bucket}>
            <div className={styles.container}>

                <div className={styles.header}>
                    <img
                        src={userdetail ? userdetail.profilePhoto : "/loader.jpg"}
                        alt="Profile Photo"
                        className={styles.avatar}
                    />
                    <div className={styles.details}>
                        <h2 className={styles.username}>{userdetail ? userdetail.username : "Loading..."}</h2>
                        <p className={styles.fullname}>{userdetail ? userdetail.fullname : "Loading..."}</p>
                        <p className={styles.fullname}>{userdetail?.gender || "Loading..."} | {userdetail?.company || "Loading"} | {userdetail?.location}</p>
                        <p className={styles.fullname}>{userdetail?.bio || "Loading..."}</p>
                        <p className={styles.fullname}>{userdetail?.vibe || "Loading..."}</p>
                    </div>
                    <div className={styles.stats}>
                        <span onClick={() => handleSwipe("post")}>
                            <i className="fa-solid fa-photo-film"></i>
                            <p>
                                <b>Posts</b>
                                <small>{myPost.length || "0"}</small>
                            </p>
                        </span>
                        <span onClick={() => handleSwipe("like")}>
                            <i className="fa-solid fa-heart"></i>
                            <p>
                                <b>Likes</b>
                                <small>{sharedPost.length || "0"}</small>
                            </p>
                        </span>
                        <span onClick={() => {
                            setEditorOpen(true);
                            setMode("friend");
                        }}>
                            <i className="fa-solid fa-users"></i>
                            <p>
                                <b>Collaboration</b>
                                <small>{userdetail?.friends.length || "0"}</small>
                            </p>
                        </span>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.edit} onClick={() => {
                            setEditorOpen(true);
                            setMode("edit");
                        }}>Edit</button>
                    </div>
                </div>

                <div className={styles.postImages}>
                    <section className={styles.cardSection}>
                        <span className={styles.cardItem}>
                            <i className="fa-solid fa-bookmark"></i>
                            <small>Saved Posts</small>
                        </span>
                        {savePost.length === 0 && <p>No posts available</p>}
                        {savePost.map((p) => (
                            <div key={p._id} className={styles.card} onClick={() => {
                                setEditorOpen(true);
                                setMode("post");
                                setPostId(p._id);
                            }}>
                                {renderFile(p?.fileUrl)}
                            </div>
                        ))}
                    </section>

                    <section className={styles.cardSection} ref={likeRef}>
                        <span className={styles.cardItem}>
                            <i className="fa-solid fa-share-nodes"></i>
                            <small>Liked Posts</small>
                        </span>
                        {sharedPost.length === 0 && <p>No posts available</p>}
                        {sharedPost.map((p) => (
                            <div key={p._id} className={styles.card} onClick={() => {
                                setEditorOpen(true);
                                setMode("post");
                                setPostId(p._id);
                            }}>
                                {renderFile(p?.fileUrl)}
                            </div>
                        ))}
                    </section>

                    <section className={styles.cardSection} ref={postRef}>
                        <span className={styles.cardItem}>
                            <i className="fa-solid fa-photo-film"></i>
                            <small>Self Posts</small>
                        </span>
                        {myPost.length === 0 && <p>No posts available</p>}
                        {myPost.map((p) => (
                            <div key={p._id} className={styles.card} onClick={() => {
                                setEditorOpen(true);
                                setMode("post");
                                setPostId(p._id);
                            }}>
                                {renderFile(p?.fileUrl)}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            {editorOpen === true
                ? <div className={styles.profileUpdate} >
                    {mode === "edit" ?
                        <ProfileUpdate details={userdetail}
                            onClose={() => setEditorOpen(false)}
                            onUpdate={() => fetchData()}
                        /> : ""}
                    {mode === "post" ?
                        <Post postId={postId} userId={userId}
                            onClose={() => setEditorOpen(false)}
                        /> : ""}
                    {mode === "friend" ?
                        <Friend friendId={userId}
                            onClose={() => setEditorOpen(false)}
                        /> : ""}
                </div>
                : ""}
        </main>
    );
}

