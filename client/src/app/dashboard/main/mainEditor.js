import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/dashboard/mainEditor/page.module.css"
import { toast } from "react-toastify";
import { AppContext } from "@/app/context/appProvider";
import { useRouter } from "next/navigation";

export default function MainsEditor({ onUpdate, onClose, mode, postId }) {
    const { owner, loading } = useContext(AppContext);
    const userId = owner?.userId;
    const router = useRouter();
    const [text, setText] = useState("");
    const [comment, setComment] = useState([]);

    const getAllComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:9876/getAllComments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ postId }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.log("res = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            console.log("All coments =:", result);
            setComment(result.post.comments);
            // toast.success(result.message);
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }
    useEffect(() => {
        getAllComments(postId);
    }, []);
    if (loading) {
        return <main className={styles.containerBox}><b>Loading in process...</b></main>;
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
    const sendComment = async (e) => {
        e.preventDefault();
        try {
            if (!text.trim()) return toast.error("Message cannot be empty");
            const response = await fetch(`http://localhost:9876/sendComment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ postId, text }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.log("res = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            // console.log("console =:", result);
            toast.success(result.message);
            setText("");
            onUpdate();
            getAllComments(postId);
            // onClose();
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }
    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:9876/deleteComment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ commentId }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.log("ress = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            // console.log("console =:", result);
            toast.success(result.message);
            getAllComments(postId);
            onUpdate();
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }
    const likeComment = async (commentId) => {
        console.log("commentid = ", commentId);
        try {
            const response = await fetch(`http://localhost:9876/likeComment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ commentId }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.log("ress = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            // console.log("console =:", result);
            toast.success(result.message);
            getAllComments(postId);
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }
    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h2>{mode} post</h2>
                <p onClick={onClose}>x</p>
            </div>
            {mode === "Comment" ?
                <div className={styles.commentBox}>
                    <section className={styles.content}>
                        {comment.length === 0 ?
                            <p className={styles.empty}>No comment available</p> :
                            comment.map((p) => (
                                <div key={p._id} className={styles.postCard} >
                                    {/* Header */}
                                    <div className={styles.postHeader} >
                                        <div className={styles.info} onClick={()=>{
                                            router.push(`/dashboard/profile/${p.profileId?.username}`)
                                        }}>
                                            <img
                                                src={p.profileId?.profilePhoto || "/loader.png"}
                                                alt={p.profileId?.username}
                                                className={styles.profileImage}
                                            />
                                            <div className={styles.postHeaderTime}>
                                                <span className={styles.username}>{p.profileId?.username}</span>
                                                <span className={styles.postTime}>{p.likes.length} likes | {formatDate(p.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.dots}>
                                            <i>{p.text}</i>
                                            {p.userId === userId ?
                                                <i className="fa-solid fa-trash-can" onClick={() => deleteComment(p._id)}></i> :
                                                p.likes.includes(userId) ?
                                                    <i className="fa-solid fa-heart" onClick={() => likeComment(p._id)} style={{color:"var(--buttonColor)"}}></i> :
                                                    <i className="fa-regular fa-heart" onClick={() => likeComment(p._id)}></i>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </section>
                    <form onSubmit={sendComment} className={styles.commentTxt}>
                        <div className={styles.textImage} >
                            <input type="text" value={text} className={styles.textarea} placeholder="Comment" onChange={(e) => setText(e.target.value)} />

                            <input type="submit" value="➤" className={styles.saveBtn} />
                        </div>
                    </form>
                </div> : ""}
        </main>
    );
}
