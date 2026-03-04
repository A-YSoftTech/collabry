
"use client";

import Card from "./card";
import styles from "../../../styles/admin/main/page.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminProfileEdit from "../user/adminProfileEdit";
export default function Main() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [post, setPost] = useState([]);
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
      setPost(result.posts);
    } catch (error) {
      toast.error(error.message);
    }
  };
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
      // console.log("user data:", data);
      setProfile(data.response);
      toast.success(data.message);
    } catch (error) {
      console.error("Repost error:", error);
      toast.error(error.message);
    }
  };
  const report = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/getReports`, {
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
      // console.log("report data:", data);
      setUsers(data.getReport);
      toast.success(data.message);
    } catch (error) {
      console.error("Repost error:", error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchPost();
    userDetails();
    report();
  }, []);

  const blockUser = profile.filter((f) => {
    return f?.userId?.role === "block"
  });
  const onlineUser = profile.filter((f) => {
    return f?.isOnline
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPosts = post.filter((p) =>
    new Date(p.createdAt) >= today
  );
  return (
    <main className={styles.container}>
      <Card head={"Total users"} quantity={profile.length} />
      <Card head={"Total posts"} quantity={post.length} />
      <Card head={"Active users"} quantity={post.length - blockUser.length} />
      <Card head={"Blocked users"} quantity={blockUser.length} />
      <Card head={"Post today"} quantity={todayPosts.length} />
      <Card head={"Online users"} quantity={onlineUser.length} />

      <div className={styles.tableWrapper}>
      <h1 className={styles.title}>Reports</h1>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Image</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Fullname</th>
              <th>Reporter username</th>
            </tr>
          </thead>

          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user?._id}
                  onClick={() => {
                    setEditorOpen(true);
                    setUserId(user?.reportId?.userId?._id);
                  }}
                >
                  <td>{user?.reportId?.userId?.email}</td>

                  <td>
                    <img
                      src={user?.reportId?.profilePhoto}
                      alt="user"
                      className={styles.userImage}
                    />
                  </td>

                  <td>{user?.reportId?.username}</td>

                  <td>{user?.reportId?.userId?.phone}</td>

                  <td>
                    <span className={styles.role}>
                      {user?.reportId?.userId?.role}
                    </span>
                  </td>

                  <td>{user?.reportId?.fullname}</td>
                  <td>{user?.userId?.username}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
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
    </main>
  );
}


