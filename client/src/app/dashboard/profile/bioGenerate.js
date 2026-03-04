
import { useRef, useState, useEffect } from "react";
import styles from "../../../styles/dashboard/profileUpdate/page.module.css"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function BioGenerator({ onClose, bioValue }) {
    const router = useRouter();

    // const [rawData, setRawData] = useState(null);
    const [interest, setInterest] = useState("");
    const [profession, setProfession] = useState("");
    const [tone, setTone] = useState("");
    const [openSection, setOpenSection] = useState(false);
    const [bio, setBio] = useState("");
    const [bio1, setBio1] = useState("");
    const [bio2, setBio2] = useState("");
    const [bio3, setBio3] = useState("");

    const generate = async (e) => {
        e.preventDefault();
        console.log(interest, profession, tone);
        try {
            if (!interest.trim() || !profession || !tone) {
                return toast.error("Please fill all the fields")
            }
            const response = await fetch("http://localhost:9876/generateBio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ interest, profession, tone }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                toast.error(data.message);
                return;
            }

            console.log("bio generate data:", data);
            setBio1(data.bio1);
            setBio2(data.bio2);
            setBio3(data.bio3);
            setBio(data.bio);
            toast.success(data.message);

        } catch (error) {
            console.error("Bio generation failed:", error);
            toast.error("Bio generation failed:", error);
        }
    }
    return (
        <main className={styles.container} style={{ width: "700px", overflowY: "auto" }}>
            <div className={styles.header}>
                <h1>Generate Bio</h1>
                <p onClick={()=>{onClose(); setOpenSection(false);}}>x</p>
            </div>
            <form onSubmit={generate}>
                <div className={styles.inputBox}>
                    <i className="fa-solid fa-heart"></i>
                    <input type="text" placeholder="Your interests or skills" onChange={(e) => setInterest(e.target.value)} />
                </div>
                <div className={styles.selectBox}>
                    <i className="fa-solid fa-briefcase"></i>
                    <select name="profession" onChange={(e) => setProfession(e.target.value)}>
                        <option value="">--Profession--</option>
                        <option value="student">Student</option>
                        <option value="developer">Developer</option>
                        <option value="entrepreneur/founder">Entrepreneur / Founder</option>
                        <option value="contentCreator">Content Creator</option>
                        <option value="designer/creative">Designer / Creative</option>
                        <option value="fitnessProfessional/coach">Fitness Professional / Coach</option>
                    </select>
                </div>
                <div className={styles.selectBox}>
                    <i className="fa-solid fa-face-smile"></i>
                    <select name="tone" onChange={(e) => setTone(e.target.value)}>
                        <option value="">--Tone--</option>
                        <option value="professsion">Profession</option>
                        <option value="casual">Casual</option>
                        <option value="funny">Funny</option>
                        <option value="motivational">Motivational</option>
                    </select>
                </div>
                <div className={styles.inputButton} onClick={()=>setOpenSection(true)}>
                    <input type="submit" value="Generate" />
                </div>
            </form>
            {openSection ?
                <section className={styles.bioBoxAI}>
                    <div className={styles.inputBoxAI}>
                        <input type="text" value={bio1} placeholder="Generated bio1" onChange={(e) => setBio1(e.target.value)} />
                        <i className="fa-solid fa-copy" onClick={() => { bioValue(bio1); onClose(); }}></i>
                    </div>
                    <div className={styles.inputBoxAI}>
                        <input type="text" value={bio2} placeholder="Generated bio2" onChange={(e) => setBio2(e.target.value)} />
                        <i className="fa-solid fa-copy" onClick={() => { bioValue(bio2); onClose(); }}></i>
                    </div>
                    <div className={styles.inputBoxAI}>
                        <input type="text" value={bio3} placeholder="Generated bio3" onChange={(e) => setBio3(e.target.value)} />
                        <i className="fa-solid fa-copy" onClick={() => { bioValue(bio3); onClose(); }}></i>
                    </div>
                    <textarea rows={5}
                        className={styles.textareaBoxAI}
                        value={bio}
                        placeholder="Generated Bio"
                        onChange={(e) => setBio(e.target.value)}>
                    </textarea>
                </section> : ""}
        </main>
    );
}
