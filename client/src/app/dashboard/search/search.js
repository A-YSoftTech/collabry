"use client"
import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/dashboard/search/page.module.css"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import getSocket from "@/app/context/getSocket";
import { AppContext } from "@/app/context/appProvider";

export default function Search() {
  const router = useRouter();
  const { owner, relationship, acceptRequest, sendFriendRequest } = useContext(AppContext);
  const userId = owner?.userId;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestionList, setSuggestionList] = useState([]);

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
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      // console.log(query);
      try {
        const response = await fetch("http://localhost:9876/searchQuery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ query }),
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
        // console.log("request:", data);
        setResults(data.users)
        // toast.success(data.message);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message);
      }
    }, 300);

    return () => clearTimeout(timer);

  }, [query]);
  useEffect(() => {
    friendSuggestion();
  }, []);

  const clearSearch = (e) => {
    e.preventDefault();
    setQuery("");
  }
  const getStatus = (userId) => {

    const status = relationship[userId] || acceptRequest[userId];

    if (status === "pending")
      return <p style={{ color: "grey" }} onClick={() => router.push(`/dashboard/notification`)}>Pending...</p>;

    if (status === "friend")
      return <p style={{ color: "#7C3AED" }}>Collabed</p>;

    return <span onClick={() => sendFriendRequest(userId)}>Collab</span>;
  };
  const socket = getSocket();
  const handleChatBox = (profile) => {
    socket.emit("openChatBox", {
      profileId: profile
    });
  }
  const friendSuggestion = async () => {
    try {
      const response = await fetch("http://localhost:9876/friendSuggestion", {
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
      // console.log("suggestion:", data);
      setSuggestionList(data.suggestions)
      toast.success(data.message);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
    }
  }

  const filterResult = results.filter(f => f.userId != userId);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <form onSubmit={clearSearch}>
          <input type="text" placeholder="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <input type="submit" value="x" />
        </form>
      </div>
      <div className={styles.box}>
        <h1>Recent</h1>
        {filterResult.length === 0 ? (
          <p>No recent searched</p>
        ) : (
          filterResult.map((r) => (
            <div key={r._id} className={styles.postCard}>
              <div className={styles.postHeader} >
                <div className={styles.info} onClick={() => {
                  router.push(`/dashboard/profile/${r.username}`);
                }}>
                  <img
                    src={r.profilePhoto || "/loader.png"}
                    alt={r.username}
                    className={styles.profileImage}
                  />
                  <div className={styles.postHeaderTime}>
                    <span className={styles.username}>{r.username}</span>
                    <span className={styles.postTime}><marquee loop={2} behavior="alternate" onMouseOver={(e) => e.target.stop()} onMouseOut={(e) => e.target.start()} scrollamount="2">{r.bio}</marquee></span>
                    {/* <span className={styles.postTime}>{r.bio.length > 40 ? r.bio.slice(0, 40) + "..." : r.bio}</span> */}
                  </div>
                </div>
                <div className={styles.dots}>
                  {getStatus(r.userId)}
                  <i className="fa-regular fa-clock" onClick={() => handleChatBox(r._id)}></i>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.box}>
        <h1>Friend Suggestion</h1>
        {suggestionList.length === 0 ? (
          ""
        ) : (
          suggestionList.map((r) => (
            <div key={r._id} className={styles.postCard}>
              <div className={styles.postHeader} >
                <div className={styles.info}>
                  <img
                    src={r.profilePhoto || "/loader.png"}
                    alt={r.username}
                    className={styles.profileImage}
                  />
                  <div className={styles.postHeaderTime}>
                    <span className={styles.username}>{r.username}</span>
                    <span className={styles.postTime}>{r.fullname} | {formatDate(r.createdAt)}</span>
                  </div>
                </div>
                <div className={styles.dots}>
                  {getStatus(r.userId)}
                  <i className="fa-regular fa-clock" onClick={() => handleChatBox(r._id)}></i>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
