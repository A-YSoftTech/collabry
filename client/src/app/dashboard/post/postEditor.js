
"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../../../styles/dashboard/postEditor/page.module.css";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PostEditor({ onUpdate, onClose, mode, postId }) {
    const router = useRouter();
    const captionRef = useRef("");
    const previewRef = useRef(null);
    const [text, setText] = useState("Enter your text...");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [txtColor, setTxtColor] = useState("#000000");

    const [type, setType] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("/loader.jpg");

    const [updateCaption, setUpdateCaption] = useState("");
    const [updateUrl, setUpdateUrl] = useState("");

    const [likeResult, setLikeResult] = useState([]);
    const [commentResult, setCommentResult] = useState([]);
    const [openTip, setOpenTip] = useState(false);
    const [generateCaption, setGenerateCaption] = useState("");
    
    const [uploading, setUploading] = useState(false);
    const [purpose, setPurpose] = useState(null);

    useEffect(() => {
        if (mode === "Update") {
            handleFetchData(postId);
        }
        if(mode === "Create Post"){
            setPurpose("post");
        }
        if(mode === "Create Status"){
            setPurpose("status");
        }
    }, []);
    // ----------------- HTML2CANVAS FUNCTION -----------------
    const generateImageFile = async () => {
        try {
            if (!previewRef.current) {
                toast.error("Preview not ready!");
                return null;
            }

            const canvas = await html2canvas(previewRef.current);
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) return reject("Failed to create blob");
                    const uniqueName = `post-${Date.now()}.png`;
                    const file = new File([blob], uniqueName, { type: "image/png" });
                    resolve(file);
                });
            });
        } catch (err) {
            console.error("Error generating image:", err);
            toast.error("Failed to generate image");
            return null;
        }
    }

    const handlePrewiewChange = (e) => {
        const file = e.target.files[0];
        // console.log("file url=",file.name);
        setUploadFile(file);
        setUpdateUrl(file.name);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrl(previewUrl);
            console.log("files:= ", previewUrl)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setUploading(true);
            const caption = captionRef.current.value;


            let file = uploadFile;

            if (type === "textImage") {
                file = await generateImageFile();
                console.log("file not available", file)
                if (!file) return;
            }

            const formData = new FormData();
            formData.append("caption", caption);
            formData.append("type", purpose);
            formData.append("image", file);
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/createPost`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error("500 error");
                return;
            }
            console.log("Backend response:", data);
            toast.success(data.message);
            setUploading(false);
            onClose();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to create post");
            setUploading(false);
        }

    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
        return date.toLocaleDateString();
    }

    const handleUpdate = async (e, data) => {
        e.preventDefault();
        try {
            setUploading(true);
            const caption = updateCaption;
            const updateId = postId;
            const url = updateUrl;
            // console.log(url);


            let file = uploadFile;

            const formData = new FormData();
            formData.append("id", updateId);
            formData.append("caption", caption);
            if (file) {
                formData.append("image", file);
            } else {
                formData.append("image", url);
            }
            // console.log("form data", formData);
            const response = await fetch(`http://localhost:9876/updatePost`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            const res = await response.json();
            if (!response.ok) {
                toast.error(res.message);
                return;
            }
            // console.log("Backend response:", res);
            toast.success(res.message);
            onUpdate();
            setUploading(false);
            onClose();
        } catch (error) {
            console.error("Error updating post:", error);
            setUploading(false);
            toast.error(error.message);
        }

    }

    const handleDelete = async (e, data) => {
        e.preventDefault();
        try {
            if (!postId) {
                console.log("id =", postId);
                toast.error("Id not exist");
                return;
            }

            const response = await fetch(`http://localhost:9876/deletePost`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
            });
            const res = await response.json();
            console.log(res);
            if (!response.ok) {
                toast.error(res.message);
                return;
            }
            console.log("Backend response:", res);
            toast.success(res.message);
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error(error.message);
        }

    }

    const handleFetchData = async (postId) => {
        console.log("id hai=", postId);
        try {
            if (!postId) {
                toast.error("Post id not exist");
                return;
            }
            const response = await fetch(`http://localhost:9876/fetchPost`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
            });
            const detail = await response.json();
            if (!response.ok) {
                if (detail.token === false) {
                    router.push("/");
                }
                toast.error(detail.message);
                return;
            }
            setUpdateCaption(detail.posts.caption);
            setUpdateUrl(detail.posts.fileUrl);
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(error.message);
        }

    }

    const likesList = async (postId) => {
        try {
            const type = "like";
            const response = await fetch(`http://localhost:9876/fetchPost`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId, type }),
            });
            const detail = await response.json();
            if (!response.ok) {
                if (detail.token === false) {
                    router.push("/");
                }
                toast.error(detail.message);
                return;
            }
            setLikeResult(detail.likesDetail);
        } catch (error) {
            console.log("likes error", error);
            toast.error(error.message);
        }
    }

    const commentList = async (postId) => {
        try {
            const type = "comment";
            const response = await fetch(`http://localhost:9876/fetchPost`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId, type })
            });
            const detail = await response.json();
            if (!response.ok) {
                if (detail.token === false) {
                    router.push("/");
                }
                toast.error(detail.message);
                return;
            }
            // console.log("comment response:", detail.commentsDetail);
            setCommentResult(detail.commentsDetail);
            // toast.success(detail.message);

        } catch (error) {
            console.log("likes error", error);
            toast.error(error.message);
        }
    }
    const engagementScore = async (context) => {
        try {
            if (!context.trim()) {
                return toast.error("Caption is empty");
            }
            const response = await fetch(`http://localhost:9876/engagementScore`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ context })
            });
            const detail = await response.json();
            if (!response.ok) {
                if (detail.token === false) {
                    router.push("/");
                }
                toast.error(detail.message);
                return;
            }
            setGenerateCaption(detail.caption);
        } catch (error) {
            console.log("score error", error);
            toast.error(error.message);
        }
    }
    const url = updateUrl || previewUrl;
    if(uploading) return <main style={{color:"var(--txt)"}}>Uploading, please wait...</main>
    return (
        <main className={`${styles.panel}`}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>{mode}</h1>
                    <p onClick={() => { onClose(); setOpenTip(false) }}>x</p>
                </div>
                {mode === "Create Post" ?
                    <form onSubmit={handleCreate}>
                        <div className={styles.textImage}>
                            <textarea type="text" placeholder="Enter you caption..." className={styles.textarea} ref={captionRef} />

                            <p className={styles.saveBtn} onClick={() => {
                                engagementScore(captionRef.current.value);
                                if (!captionRef.current.value.trim()) {
                                    setOpenTip(false);
                                } else {
                                    setOpenTip(true);
                                }
                            }}>Check Performance ✨
                            </p>

                            {openTip ? <textarea rows={8}
                                value={generateCaption}
                                placeholder="Generated caption"
                                className={styles.textarea}
                                onChange={(e) => setGenerateCaption(e.target.value)} /> : ""}

                            <input type="file" className={styles.textarea} onChange={handlePrewiewChange} />


                            <div className={styles.preview} style={{ background: bgColor, color: txtColor }} ref={previewRef}>
                                {uploadFile?.type?.startsWith("video/")
                                    ? <video src={previewUrl} autoPlay muted loop playsInline />
                                    : uploadFile?.type?.startsWith("image/")
                                        ? <img src={previewUrl} alt="preview" />
                                        : <img src="/loader.jpg" alt="preview" />}
                            </div>
                            {uploadFile?.type?.startsWith("video/") || uploadFile?.type?.startsWith("image/")
                                ? <input type="submit" value="Post" className={styles.saveBtn} /> : ""}
                        </div>
                    </form>: ""}
                {mode === "Create Status" ?
                    <form onSubmit={handleCreate}>
                        <div className={styles.type}>
                            <p onClick={() => { setType("textImage"); setOpenTip(false); }}>Text Image</p>
                            <p onClick={() => { setType("image"); setOpenTip(false); }}>Image</p>
                            <p onClick={() => { setType("video"); setOpenTip(false); }}>Video</p>
                        </div>
                        {type === "textImage" ?
                            <div className={styles.textImage}>
                                <textarea placeholder="Enter you caption..." className={styles.textarea} ref={captionRef} />

                                <p className={styles.saveBtn} onClick={() => {
                                    engagementScore(captionRef.current.value);
                                    if (!captionRef.current.value.trim()) {
                                        setOpenTip(false);
                                    } else {
                                        setOpenTip(true);
                                    }
                                }}>Check Performance ✨
                                </p>

                                {openTip ? <textarea rows={8}
                                    value={generateCaption}
                                    placeholder="Generated caption"
                                    className={styles.textarea}
                                    onChange={(e) => setGenerateCaption(e.target.value)} /> : ""}

                                <textarea placeholder="Enter your text..." className={styles.textarea} onChange={(e) => setText(e.target.value)} />

                                <div>
                                    <label htmlFor="background">Select background color</label>
                                    <input type="color" name="background" id="background" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="text">Select text color</label>
                                    <input type="color" name="text" id="text" value={txtColor} onChange={(e) => setTxtColor(e.target.value)} />
                                </div>
                                <div className={styles.preview} style={{ background: bgColor, color: txtColor }} ref={previewRef}>
                                    {text}
                                </div>
                                <input type="submit" value="Post" className={styles.saveBtn} />
                            </div> : ""}
                        {type === "image" ?
                            <div className={styles.textImage}>
                                <textarea type="text" placeholder="Enter you caption..." className={styles.textarea} ref={captionRef} />

                                <p className={styles.saveBtn} onClick={() => {
                                    engagementScore(captionRef.current.value);
                                    if (!captionRef.current.value.trim()) {
                                        setOpenTip(false);
                                    } else {
                                        setOpenTip(true);
                                    }
                                }}>Check Performance ✨
                                </p>

                                {openTip ? <textarea rows={8}
                                    value={generateCaption}
                                    placeholder="Generated caption"
                                    className={styles.textarea}
                                    onChange={(e) => setGenerateCaption(e.target.value)} /> : ""}

                                <input type="file" className={styles.textarea} onChange={handlePrewiewChange} />


                                <div className={styles.preview} style={{ background: bgColor, color: txtColor }} ref={previewRef}>
                                    <img src={previewUrl} alt="preview" />
                                </div>
                                <input type="submit" value="Post" className={styles.saveBtn} />
                            </div> : ""}
                        {type === "video" ?
                            <div className={styles.textImage}>
                                <textarea type="text" placeholder="Enter you caption..." className={styles.textarea} ref={captionRef} />

                                <p className={styles.saveBtn} onClick={() => {
                                    engagementScore(captionRef.current.value);
                                    if (!captionRef.current.value.trim()) {
                                        setOpenTip(false);
                                    } else {
                                        setOpenTip(true);
                                    }
                                }}>Check Performance ✨
                                </p>

                                {openTip ? <textarea rows={8}
                                    value={generateCaption}
                                    placeholder="Generated caption"
                                    className={styles.textarea}
                                    onChange={(e) => setGenerateCaption(e.target.value)} /> : ""}

                                <input type="file" className={styles.textarea} onChange={handlePrewiewChange} />


                                <div className={styles.preview} style={{ background: bgColor, color: txtColor }} ref={previewRef}>
                                    <video src={previewUrl} autoPlay muted loop playsInline />
                                </div>
                                <input type="submit" value="Post" className={styles.saveBtn} />
                            </div> : ""}
                    </form>: ""}
                {mode === "Update" ?
                    <form onSubmit={handleUpdate}>
                        <div className={styles.textImage}>
                            <textarea rows={6} type="text"
                                placeholder="Enter you caption..."
                                className={styles.textarea} value={updateCaption}
                                onChange={(e) => setUpdateCaption(e.target.value)} ref={captionRef} />

                            <p className={styles.saveBtn} onClick={() => {
                                engagementScore(captionRef.current.value);
                                if (!captionRef.current.value.trim()) {
                                    setOpenTip(false);
                                } else {
                                    setOpenTip(true);
                                }
                            }}>Check Performance ✨
                            </p>

                            {openTip ? <textarea rows={8}
                                value={generateCaption}
                                placeholder="Generated caption"
                                className={styles.textarea}
                                onChange={(e) => setGenerateCaption(e.target.value)} /> : ""}

                            <input type="file" className={styles.textarea} onChange={handlePrewiewChange} />
                            {/* <div className={styles.preview} style={{ background: bgColor, color: txtColor }} ref={previewRef}>
                                {updateUrl?.endsWith(".mp4") || updateUrl?.endsWith(".mov") || updateUrl?.endsWith(".webm") ? (
                                    <video src={url} autoPlay muted loop playsInline />
                                ) : updateUrl?.endsWith(".png") || updateUrl?.endsWith(".jpg") || updateUrl?.endsWith(".jpeg") ? (
                                    <img src={url} alt="preview" />
                                ) : (
                                    <img src="/loader.jpg" alt="preview" />
                                )}
                                </div> */}
                            <input type="submit" value="Update" className={styles.saveBtn} />
                        </div>
                    </form> : ""}
                {mode === "Delete" ?
                    <form onSubmit={handleDelete}>
                        <div className={styles.textImage}>
                            <p>Confirm want to delete this post?</p>

                            <input type="submit" value=" Confirm Delete" className={styles.delBtn} />
                        </div>
                    </form> : ""}
                {mode === "Likes" ?
                    <div className={styles.likeBox}>
                        <button onClick={() => likesList(postId)} className={styles.butt}>Show data</button>

                        <textarea rows={1} type="text" value={postId} className={styles.idbox} readOnly />

                        <div className={styles.box}>
                            {likeResult.length === 0 ? (
                                <p>No users found</p>
                            ) : (
                                likeResult.map((r) => (
                                    <div key={r._id} className={styles.postCard}>
                                        <div className={styles.postHeader} >
                                            <div className={styles.info} onClick={() => {
                                                router.push(`/dashboard/profile?userId=${r.userId}`);
                                            }}>
                                                <img
                                                    src={r.profilePhoto || "/loader.jpg"}
                                                    alt={r.username}
                                                    className={styles.profileImage}
                                                />
                                                <div className={styles.postHeaderTime}>
                                                    <span className={styles.username}>{r.username}</span>
                                                    <span className={styles.postTime}>{(r.fullname)}</span>
                                                </div>
                                            </div>
                                            {/* <div className={styles.dots}>
                                                    <i>{r.status}</i>
                                                    <i className="fa-solid fa-trash-can" onClick={() => deleteSendRequest(r.userId)}></i>
                                                    </div> */}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div> : ""}
                {mode === "Comments" ?
                    <div className={styles.likeBox}>
                        <button onClick={() => commentList(postId)} className={styles.butt}>Show data</button>

                        <textarea rows={1} type="text" value={postId} className={styles.idbox} readOnly />

                        <div className={styles.box}>
                            {commentResult.length === 0 ? (
                                <p>No users found</p>
                            ) : (
                                commentResult.map((r) => (
                                    <div key={r._id} className={styles.postCard}>
                                        <div className={styles.postHeader} >
                                            <div className={styles.info} onClick={() => {
                                                router.push(`/dashboard/profile?userId=${r.userId._id}`);
                                            }}>
                                                <img
                                                    src={r.userId.profilePhoto || "/loader.png"}
                                                    alt={r.userId.username}
                                                    className={styles.profileImage}
                                                />
                                                <div className={styles.postHeaderTime}>
                                                    <span className={styles.username}>{r.userId.username} </span>
                                                    <span className={styles.postTime}>{(r.userId.fullname)} | {formatDate(r.updatedAt)} </span>
                                                </div>
                                            </div>
                                            <div className={styles.dots}>
                                                <i>"{r.text}"</i>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div> : ""}
            </div>
        </main >
    );

}