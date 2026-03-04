"use client"

import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/dashboard/notification/page.module.css"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Friend from "../friend/friend";
import { AppContext } from "@/app/context/appProvider";
// import Mains from "../main/main";
export default function Notification() {
  // const searchParams = useSearchParams();
  // const userId = searchParams.get("userId");
  const router = useRouter();
  // const [sendRequest, setSendRequest] = useState([]);
  // const [receiveRequest, setReceiveRequest] = useState([]);
  // const [chatRequest, setchatRequest] = useState([]);
  const {sendRequest, receiveRequest, chatRequest, requestNotification, chatNotification} = useContext(AppContext);

  if(!sendRequest || !receiveRequest || !chatRequest){
    return <main className={styles.containerBox}>Loading notification...</main>
  }

  useEffect(() => {
    requestNotification();
    chatNotification();
  }, []);

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

  const deleteSendRequest = async (deleteId) => {
    try {
      const response = await fetch("http://localhost:9876/deleteSendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ deleteId }),
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
      requestNotification();
    } catch (error) {
      console.error("delete error", error);
      toast.error(error.message);
    }
  }
  const rejectReceiveRequest = async (deleteId) => {
    try {
      const response = await fetch("http://localhost:9876/rejectReceiveRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ deleteId }),
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
      requestNotification();
    } catch (error) {
      console.error("delete error", error);
      toast.error(error.message);
    }
  }
  const acceptReceiveRequest = async (acceptId) => {
    try {
      const response = await fetch("http://localhost:9876/acceptReceiveRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ acceptId }),
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
      console.log("request:", data);
      toast.success(data.message);
      requestNotification();
    } catch (error) {
      console.error("delete error", error);
      toast.error(error.message);
    }
  }
  const sendPending = sendRequest.filter(r => r.status === "pending");
  const receivePending = receiveRequest.filter(r => r.status === "pending");
  return (
    <main className={styles.containerBox}>
      <section className={styles.container}>
        <div className={styles.header}>
          <h1>Notifications</h1>
          <p>{sendPending.length + receivePending.length + chatRequest.length}</p>
        </div>
        <div className={styles.box}>
          <h1>Send Notif</h1>
          {sendPending.length === 0 ? (
            <p>No notification available</p>
          ) : (
            sendPending.map((r) => (
              <div key={r._id} className={styles.postCard}>
                <div className={styles.postHeader} >
                  <div className={styles.info} onClick={() => {
                    router.push(`/dashboard/profile/${r.userProfileId.username}`);
                  }}>
                    <img
                      src={r.userProfileId.profilePhoto || "/loader.png"}
                      alt={r.userProfileId.username}
                      className={styles.profileImage}
                    />
                    <div className={styles.postHeaderTime}>
                      <span className={styles.username}>{r.userProfileId.username}</span>
                      <span className={styles.postTime}>You send collab request to {r.userProfileId.fullname} | {formatDate(r.createdAt)} ago</span>
                    </div>
                  </div>
                  <div className={styles.dots}>
                    <p>{r.status}...</p>
                    <i className="fa-solid fa-trash-can" onClick={() => deleteSendRequest(r.userId)}></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.box}>
          <h1>Receive Notif</h1>
          {receivePending.length === 0 ? (
            <p>No notification available</p>
          ) : (
            receivePending.map((r) => (
              <div key={r._id} className={styles.postCard}>
                <div className={styles.postHeader} >
                  <div className={styles.info} onClick={() => {
                    router.push(`/dashboard/profile/${r.ownerProfileId.username}`);
                    }}>
                    <img
                      src={r.ownerProfileId.profilePhoto || "/loader.png"}
                      alt={r.ownerProfileId.username}
                      className={styles.profileImage}
                    />
                    <div className={styles.postHeaderTime}>
                      <span className={styles.username}>{r.ownerProfileId.username}</span>
                      <span className={styles.postTime}>{r.ownerProfileId.fullname} sent you a collab request | {formatDate(r.createdAt)} ago</span>
                    </div>
                  </div>
                  <div className={styles.dots}>
                    <span onClick={() => acceptReceiveRequest(r.ownerId)}>Accept</span>
                    <i className="fa-solid fa-trash-can" onClick={() => rejectReceiveRequest(r.ownerId)}></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.box}>
          <h1>Chat message</h1>
          {chatRequest.length === 0 ? (
            <p>No chat available</p>
          ) : (
            chatRequest.map((r) => (
              <div key={r._id} className={styles.postCard}>
                <div className={styles.postHeader} >
                  <div className={styles.info} onClick={() => {
                    router.push(`/dashboard/profile/${r.senderId.username}`);
                    }}>
                    <img
                      src={r.senderId.profilePhoto || "/loader.png"}
                      alt={r.senderId.username}
                      className={styles.profileImage}
                    />
                    <div className={styles.postHeaderTime}>
                      <span className={styles.username}>{r.senderId.username}</span>
                      <span className={styles.postTime}>{r.text}</span>
                    </div>
                  </div>
                  <div className={styles.dots}>
                    {/* <span onClick={() => acceptReceiveRequest(r.ownerId)}>Accept</span> */}
                    <small>{formatDate(r.createdAt)} ago</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <section>
        <Friend/>
      </section>
    </main>
  );
}
