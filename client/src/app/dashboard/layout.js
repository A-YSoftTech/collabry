
"use client";
import { useContext, useEffect, useState } from "react";
import "../globals.css";
import styles from "../../styles/DashboardLayout/layout/page.module.css";
import Sidebar from "./sidebar/page";
import ChatBox from "./chat/chatBox";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import getSocket from "../context/getSocket";
import AppProvider from "../context/appProvider";
// import { AppProvider } from "../context/appProvider";
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [profileId, setProfileId] = useState([]);

  const [centerId, setCenterId] = useState(null); // 👈 NEW

  const socket = getSocket();
  useEffect(() => {
    setTimeout(() => {
      socket.emit("checkChatBox");
    }, 500);

    socket.on("chatBoxStatus", (detail) => {
      console.log("chatBoxStatus = ", detail);

      if (!detail) {
        setChatOpen(false);
        setProfileId([]);
        return;
      }
      setChatOpen(detail.chatOpen);
      setProfileId(detail.activeProfileId);
      setCenterId(detail.activeProfileId[0]); // 👈 first chat center
    });

    return () => {
      socket.off("chatBoxStatus");
    };
  }, []);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);


  return (
    <main className={styles.main}>
      <div className={styles.sidenavbar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        {/* <AppProvider> */}
        {children}
        {/* </AppProvider> */}
      </div>

      {chatOpen &&
        profileId.map((id, index) => (
          <ChatBox key={id}
            profileId={id}
            index={index}
            isCenter={id === centerId} />
        ))
      }
    </main>
  );
}


