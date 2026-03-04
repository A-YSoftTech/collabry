"use client"
import { toast } from 'react-toastify';
import style from '../../../styles/dashboard/sidebar/page.module.css'
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import getSocket from '@/app/context/getSocket';
import PostEditor from '../post/postEditor';
import Notification from '../notification/notification';
import { AppContext } from '@/app/context/appProvider';

export default function Sidebar() {
  const router = useRouter();
  const [boxOpen, SetBoxOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const { sendRequest, receiveRequest, chatRequest } = useContext(AppContext);

  if (!sendRequest || !receiveRequest || !chatRequest) {
    return <main className={`${style.container} ${collapsed ? style.collapsed : ""}`}>Loading...</main>
  }
  const sendPending = sendRequest.filter(r => r.status === "pending");
  const receivePending = receiveRequest.filter(r => r.status === "pending");
  const notify = sendPending.length + receivePending.length

  const toggleTheme = () => {
    const root = document.documentElement;

    if (root.classList.contains("light")) {
      root.classList.remove("light"); // switch to dark
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light"); // switch to light
      localStorage.setItem("theme", "light");
    }
  };

  const submitLogout = async () => {
    try {
      const socket = getSocket();
      socket.disconnect();

      const response = await fetch("http://localhost:9876/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })
      const data = await response.json();
      if (!response.ok) {
        console.log("Error:", data.message);
        toast.error(data.message);
        return;
      }
      console.log("Success:", data);
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
    }
  }

  return (
    <main className={`${style.container} ${collapsed ? style.collapsed : ""}`}>

      <div className={style.menuSection}>
        <a href='/dashboard/main' className={style.logoBox}>
          <img src="/logo.png" alt="Collabry Logo" />
          <span title="Logo">Collabry</span>
        </a>

        <a href={`/dashboard/main`} className={style.menuItem}>
          <i className="fa-solid fa-house"></i>
          <span title="Main feed: notes, posts, updates.">Home</span>
        </a>

        <a href="/dashboard/chat" className={style.menuItem}>
          <i className="fa-solid fa-message">{chatRequest.length > 0 ? <b className={style.redDot}></b> : ""}</i>
          <span title="One-to-one or group chatting.">Chat</span>
        </a>


        <a href={`#createPost`} className={style.menuItem} id={style.post} onClick={() => {
          setEditorOpen(true);
          setMode('Create Post');
        }}>
          <i className="fa-solid fa-plus"></i>
          <span title="Likes, comments, group invites, updates.">Post</span>
        </a>

        <a href={`/dashboard/profile`} className={style.menuItem}>
          <i className="fa-solid fa-circle-user"></i>
          <span title="User profile, bio, settings, achievements.">Profile</span>
        </a>
      </div>

      <div className={style.bottomSection}>

        <a href="#" className={style.menuItem} onClick={() => SetBoxOpen(true)}>
          <i className="fa-solid fa-bars-staggered"></i>
          <span title="More option.">More</span>
        </a>


        {boxOpen ?
          <div className={style.option}>
            <a href="#" className={style.menuItem} onClick={toggleTheme}>
              <i className="fa-solid fa-circle-half-stroke"></i>
              <span title="Toggle theme.">Theme</span>
            </a>
            <a href="#" className={style.menuItem} onClick={submitLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span title="Safe logout option.">Logout</span>
            </a>
          </div> : ""}

        <a href={`/dashboard/notification`} className={style.menuItem} id={style.notif}>
          <i className="fa-solid fa-bell">{notify > 0 ? <b className={style.redDot}></b> : ""}</i>
          <span title="Likes, comments, group invites, updates.">Notification</span>
        </a>
        <button className={style.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <i className="fa-solid fa-arrow-right"></i> : <i className="fa-solid fa-arrow-left-long"></i>}
        </button>
      </div>
      {editorOpen === true ?
        <div className={style.createPost} >
          {mode === "Create Post" ?
            <PostEditor mode={mode}
              onClose={() => {
                setEditorOpen(false);
                setMode("");
              }}
            /> : ""}
        </div>
        : ""}

    </main>
  );
}
