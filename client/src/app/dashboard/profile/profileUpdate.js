
import { useRef, useState, useEffect } from "react";
import styles from "../../../styles/dashboard/profileUpdate/page.module.css"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import BioGenerator from "./bioGenerate";

export default function ProfileUpdate({ mode, details, onClose, onUpdate }) {
    const router = useRouter();

    const [openBio, setOpenBio] = useState(false);
    const [bio, setBio] = useState("");
    const [rawData, setRawData] = useState(details);
    const [gender, setGender] = useState("");
    const [status, setStatus] = useState("");
    const [vibe, setVibe] = useState("");
    const [uploading, setUploading] = useState(false);

    const imageRef = useRef(null);
    const usernameRef = useRef();
    const vibeRef = useRef();
    const fullnameRef = useRef();
    const companyRef = useRef();
    const genderRef = useRef();
    const locationRef = useRef();
    const bioRef = useRef();
    const statusRef = useRef();
    const instagramRef = useRef();
    const twitterRef = useRef();
    const youtubeRef = useRef();
    const linkedinRef = useRef();
    // console.log("vibe = ", vibeRef.current)
    useEffect(() => {
        if (rawData) {
            setVibe(rawData.vibe || "");
            setGender(rawData.gender || "");
            setStatus(rawData.status || "");
            setBio(rawData.bio || "");
        }
    }, [rawData]);
    const updateprofile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (imageRef.current.files.length > 0) {
            formData.append("image", imageRef.current.files[0]);
        }
        formData.append('username', usernameRef.current.value);
        formData.append('vibe', vibeRef.current.value);
        formData.append('fullname', fullnameRef.current.value);
        formData.append('company', companyRef.current.value);
        formData.append('gender', genderRef.current.value);
        formData.append('location', locationRef.current.value);
        formData.append('bio', bioRef.current.value);
        formData.append('status', statusRef.current.value);
        formData.append('instagram', instagramRef.current.value);
        formData.append('twitter', twitterRef.current.value);
        formData.append('youtube', youtubeRef.current.value);
        formData.append('linkedin', linkedinRef.current.value);
        try {
            setUploading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/updateProfile`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                toast.error(data.message);
                return;
            }

            console.log("Profile updated:", data);
            toast.success(data.message);
            onUpdate();
            onClose();
            setUploading(false);

        } catch (error) {
            console.error("Update failed:", error);
            setUploading(false);
            toast.error("Update failed:", error);
        }
    }
    if (uploading) return <main  style={{ color: "var(--txt)" }}>Uploading, please wait...</main>
    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>Edit profile</h1>
                <p onClick={onClose}>x</p>
            </div>
            <form onSubmit={updateprofile} style={{ overflowY: "auto" }}>

                <div className={styles.inputBox}>
                    <i className="fa-solid fa-camera"></i>
                    <input type="file" ref={imageRef} />
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-solid fa-circle-user"></i>
                    <input type="text" defaultValue={rawData?.username || ""} placeholder="Username" ref={usernameRef} />
                </div>
                <div className={styles.selectBox}>
                    <i className="fa-regular fa-face-smile-wink"></i>
                    <select name="vibe" value={vibe} onChange={(e) => setVibe(e.target.value)} ref={vibeRef}>
                        <option value="">--Vibe--</option>
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
                    <i className="fa-solid fa-user"></i>
                    <input type="text" defaultValue={rawData?.fullname || ""} placeholder="Full name" ref={fullnameRef} />
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-solid fa-building"></i>
                    <input type="text" defaultValue={rawData?.company || ""} placeholder="Full name" ref={companyRef} />
                </div>
                <div className={styles.selectBox}>
                    {gender === "Female" ? <i className="fa-solid fa-venus"></i> : <i className="fa-solid fa-mars"></i>}
                    <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)} ref={genderRef}>
                        <option value="Gender">--Gender--</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-solid fa-location-dot"></i>
                    <input type="text" defaultValue={rawData?.location || ""} placeholder="Location" ref={locationRef} />
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-solid fa-quote-left"></i>
                    <input type="text" defaultValue={bio} placeholder="Bio" ref={bioRef} />
                    <p onClick={() => setOpenBio(true)}>Generate ✨</p>
                </div>
                <div className={styles.selectBox}>
                    {status == "public" ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
                    <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} ref={statusRef}>
                        <option value="">--Status--</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-brands fa-instagram"></i>
                    <input type="text" defaultValue={rawData?.instagram || ""} placeholder="Instagram Link" ref={instagramRef} />
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-brands fa-twitter"></i>
                    <input type="text" defaultValue={rawData?.twitter || ""} placeholder="Twitter Link" ref={twitterRef} />
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-brands fa-youtube"></i>
                    <input type="text" defaultValue={rawData?.youtube || ""} placeholder="Youtude Link" ref={youtubeRef} />
                </div>
                <div className={styles.inputBox}>
                    <i className="fa-brands fa-linkedin"></i>
                    <input type="text" defaultValue={rawData?.linkedin || ""} placeholder="LinkedIn Link" ref={linkedinRef} />
                </div>
                <div className={styles.inputButton}>
                    <input type="submit" value="Update" />
                </div>
            </form>
            {openBio
                ? <div className={styles.bioUpdate} >
                    <BioGenerator
                        onClose={() => { setOpenBio(false) }}
                        bioValue={(value) => setBio(value)}
                    />
                </div>
                : ""}
        </main>
    );
}
