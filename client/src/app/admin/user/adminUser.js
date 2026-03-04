
"use client";
import styles from "../../../styles/admin/adminUsers/page.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminProfileEdit from "./adminProfileEdit";

export default function AdminUser() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [editorOpen, setEditorOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const userDetails = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/allProfiles`, {
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
            console.log("user data:", data);
            setUsers(data.response);
            toast.success(data.message);
        } catch (error) {
            console.error("Repost error:", error);
            toast.error(error.message);
        }
    };
    useEffect(() => {
        userDetails();
    }, [])
    return (
        <div className={styles.adminUsersContainer}>
            <h1 className={styles.title}>All Users</h1>

            <div className={styles.tableWrapper}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Image</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Fullname</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user?._id} onClick={() => {
                                    setEditorOpen(true);
                                    setUserId(user?.userId?._id);
                                }}>
                                    <td>{user?.userId?.email}</td>

                                    <td>
                                        <img
                                            src={user?.profilePhoto || "/default.png"}
                                            alt="user"
                                            className={styles.userImage}
                                        />
                                    </td>

                                    <td>{user?.username}</td>

                                    <td>{user?.userId?.phone}</td>

                                    <td>
                                        <span className={styles.role}>
                                            {user?.userId?.role}
                                        </span>
                                    </td>

                                    <td>{user.fullname}</td>
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
            {editorOpen ?
                <div className={styles.editor}>
                    <AdminProfileEdit
                        userId={userId}
                        onClose={() => { 
                            setEditorOpen(false);
                            userDetails();
                        }}
                    />
                </div>
                : ""}
        </div>
    );
}


