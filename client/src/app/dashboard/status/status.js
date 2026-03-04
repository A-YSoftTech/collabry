import { useState, useEffect, useContext } from "react";
import styles from "../../../styles/dashboard/status/page.module.css"
import PostEditor from "../post/postEditor";
import Post from "../post/post";
import { toast } from "react-toastify";
import { AppContext } from "@/app/context/appProvider";
export default function Status() {
    const { owner, loading } = useContext(AppContext);
    const [editorOpen, setEditorOpen] = useState(false);
    const [mode, setMode] = useState("");
    const [post, setPost] = useState([]);
    const [postId, setPostId] = useState(null);

    const userId = owner?.userId;

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
            // setSavedPost(result.savedPost);
            setPost(result.posts);
        } catch (error) {
            toast.error(error.message);
        }
    };
    useEffect(() => {
        fetchPost();
    }, []);
    if (loading) {
        return <main className={styles.bucket}>Loading...</main>;
    }

    // if (!owner) {
    //     return <main className={styles.bucket}>No owner data</main>;
    // }
    const filterPost = post.filter(f => {
        return f.profileId?.status === "public" && f.type === "status";
    });
    return (
        <main className={styles.container}>
            <div className={styles.yourself}>
                <span className={styles.mine} onClick={() => {
                    setEditorOpen(true);
                    setMode('Create Status');
                }}>
                    <p>+</p>
                    {/* <img src="/loader.jpg" alt="" className={styles.image} /> */}
                </span>
            </div>
            <div className={styles.friends}>
                {filterPost.length === 0 ? (
                    <p>no status available</p>
                ) : (
                    filterPost.map((p) => (
                        <span key={p._id} className={styles.mine} onClick={() => {
                            setEditorOpen(true);
                            setMode("post");
                            setPostId(p._id);
                        }}>
                            <img src={p.profileId.profilePhoto || "/loader.png"}
                                alt={p.profileId.username}
                                className={styles.image} />
                        </span>

                    ))
                )}
            </div>
            {editorOpen === true ?
                <div className={styles.createPost} >
                    {mode === "Create Status" ?
                        <PostEditor mode={mode}
                            onClose={() => {
                                setEditorOpen(false);
                                setMode("");
                            }}
                        /> : ""}
                    {mode === "post" ?
                        <Post postId={postId} userId={userId}
                            onClose={() => setEditorOpen(false)}
                        /> : ""}
                </div>
                : ""}
        </main>
    );
}
