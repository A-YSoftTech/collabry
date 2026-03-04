"use client";

import { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/popProfile/page.module.css";
import { useRouter } from "next/navigation";

export default function PopProfile() {
  const router = useRouter();

  const usernameRef = useRef();
  const fullnameRef = useRef();
  const vibeRef = useRef();
  const locationRef = useRef();

  const handleColor = () => {
    if (vibeRef.current.value) {
      vibeRef.current.style.color = "var(--txt)";
    } else {
      vibeRef.current.style.color = "rgba(248, 250, 252, 0.7)";
    }
  }

  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/checkProfileExistence`, {
          method: "POST",
          credentials: "include",
        })
        const data = await response.json();
        if (!response.ok) {
          if (data.token === false) {
            router.push("/");
          }
          toast.info(data.message);
          return;
        }
        router.push(`/dashboard/main`);
      } catch (error) {
        toast.error(error.message);
      }
    }
    checkExistingProfile();
  }, []);

  const createProfile = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value.trim();

    const usernameRegex = /^(?![-_!])[a-zA-Z0-9-_!]{3,20}$/;

    if (!username) {
      return toast.error("Username required");
    }

    if (!usernameRegex.test(username)) {
      return toast.error(
        "Username must be 3–20 chars, letters, numbers, -, _, ! and cannot start with special character"
      );
    }
    const formdata = {
      username: usernameRef.current.value.trim(),
      fullname: fullnameRef.current.value.trim(),
      vibe: vibeRef.current.value.trim(),
      location: locationRef.current.value.trim(),
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/createProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formdata)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.token === false) {
          router.push("/");
        }
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.push(`/dashboard/main`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <img src="bgimage.png" alt="backgroundImage" />
      <div className={styles.container}>
        <form onSubmit={createProfile}>
          <div className={styles.header}>
            <h1>Create Profile</h1>
          </div>

          <div className={styles.inputBox}>
            <i className="fa-regular fa-user"></i>
            <input type="text" placeholder="e.g: example_123" ref={usernameRef} />
          </div>

          <div className={styles.inputBox}>
            <i className="fa-solid fa-id-card"></i>
            <input type="text" placeholder="e.g: John Deo" ref={fullnameRef} />
          </div>

          <div className={styles.inputBox}>
            <i className="fa-regular fa-face-smile"></i>
            <select ref={vibeRef} onChange={handleColor}>
              <option value="">--vibe--</option>
              <option value="happy">😄 Happy</option>
              <option value="cool">😎 Cool</option>
              <option value="calm">😌 Calm</option>
              <option value="angry">😡 Angry</option>
              <option value="sad">😢 Sad</option>
              <option value="love">🥰 Love</option>
              <option value="funny">😂 Funny</option>
              <option value="shocked">😲 Shocked</option>
              <option value="sleepy">😴 Sleepy</option>
              <option value="thinking">🤔 Thinking</option>
              <option value="nervous">😬 Nervous</option>
              <option value="sick">🤒 Sick</option>
              <option value="party">🥳 Party</option>
              <option value="confused">😕 Confused</option>
              <option value="shy">😊 Shy</option>
              <option value="annoying">😒 Annoying</option>
            </select>
          </div>

          <div className={styles.inputBox}>
            <i className="fa-solid fa-location-dot"></i>
            <input type="text" placeholder="e.g: state, district" ref={locationRef} />
          </div>

          <div className={styles.inputButton}>
            <input type="submit" value="Create" />
          </div>
        </form>
      </div>
    </main>
  );
}
