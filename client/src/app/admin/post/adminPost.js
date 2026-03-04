
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../../styles/admin/adminPost/page.module.css"
import { useRouter } from "next/navigation";


export default function AdminPost() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
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

            // console.log("console =", result);
            setUsers(result.posts);
        } catch (error) {
            toast.error(error.message);
        }
    };
    useEffect(() => {
        fetchPost();
    }, []);
    const renderFile = (fileUrl) => {
        if (!fileUrl) return null;
        const lower = fileUrl.toLowerCase();

        // ------ IMAGE ------
        if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return <img src={fileUrl} className={styles.userImage} alt="post image" />;
        }

        // ------ VIDEO ------
        if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm")) {
            return <video src={fileUrl} className={styles.userImage} muted loop playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => { e.target.pause(); }} />;
        }

        // ------ UNKNOWN ------
        return <a href={fileUrl} target="_blank">Download File</a>;
    };
    const onDelete = async (deleteId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/deleteAdminPost`, {
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
            fetchPost();
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    return (
        <div className={styles.adminUsersContainer}>
            <h2 className={styles.title}>Posts</h2>

            <div className={styles.tableWrapper}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Post ID</th>
                            <th>Type</th>
                            <th>Username</th>
                            <th>Details</th>
                            <th>Caption</th>
                            <th>Post</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user?._id}>
                                    <td>{user?._id}</td>

                                    <td>
                                        {user?.type}
                                    </td>

                                    <td>{user?.profileId?.username}</td>
                                    <td>{user?.type === "status" ? 
                                    `${user?.viewers.length} viewers` : 
                                    `${user?.likes.length} likes, ${user?.comments.length} comments`}</td>
                                    <td>{user?.caption}</td>


                                    <td>
                                        <span className={styles.role}>
                                            {renderFile(user?.fileUrl)}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className={`${styles.btn} ${styles.delete}`}
                                            onClick={() => onDelete(user?._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* {editorOpen ?
                <div className={styles.editor}>
                    <AdminProfileEdit
                        userId={userId}
                        onClose={() => {
                            setEditorOpen(false);
                            userDetails();
                        }}
                    />
                </div>
                : ""} */}
        </div>
    );
}


