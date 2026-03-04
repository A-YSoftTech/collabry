"use client"
import { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/Authentication/auth/page.module.css";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { AppContext } from "../context/appProvider";


export default function Auth() {
    const router = useRouter();

    const [mode, setMode] = useState("login");
    const [hideShow, setHideShow] = useState("hide");

    const usernameRef = useRef("");
    const phoneRef = useRef("");
    const roleRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const handleColor = ()=>{
        if(roleRef.current.value){
            roleRef.current.style.color= "var(--txt)";
        }else{
            roleRef.current.style.color= "rgba(248, 250, 252, 0.7)";
        }
    }

    const submitRegister = async (e) => {
        e.preventDefault();
        const registerData = {
            username: usernameRef.current.value,
            phone: phoneRef.current.value,
            role: roleRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            })
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            setMode("login");
        } catch (error) {
            toast.error(error);
        }
    }
    const submitLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(loginData)
            })
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            // console.log("login = ", data)
            toast.success(data.message);
            if(data.loginDetails.role === "admin"){
                setTimeout(() => {
                    router.push(`/admin`);
                }, 50);
            }else{
                setTimeout(() => {
                    router.push(`/popProfile`);
                }, 50);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const submitResetPassword = async (e) => {
        e.preventDefault();
        const resetData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmPassword: confirmPasswordRef.current.value,
        };
        console.log("resetdata = ", resetData);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/resetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resetData)
            })
            const data = await response.json();
            if (!response.ok) {
                console.log("Response error:", data.message);
                toast.error(data.message);
                return;
            }

            console.log("Reset password :", data);
            toast.success(data.message);
            setMode("login");
        } catch (error) {
            console.error("Reset password catch error:", error);
            toast.error(error.message);
        }
    }

    return (
        <main className={styles.pageWrapper}>
            <img src="bgimage.png" alt="backgroundImage" />

            <div className={styles.container}>
                {mode === "register" ?
                    <form onSubmit={submitRegister}>
                        <div className={styles.header}>
                            {/* <h1>Register</h1> */}
                            <img src="/logoImage.png" alt="Image" />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-regular fa-user"></i>
                            <input type="text" placeholder="Enter your name" ref={usernameRef} />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-solid fa-phone"></i>
                            <input type="text" placeholder="Enter your phone" ref={phoneRef} />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-solid fa-shield-halved"></i>
                            <select ref={roleRef} onChange={handleColor}>
                                <option value="">--role--</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        <div className={styles.inputBox}>
                            <i className="fa-regular fa-envelope"></i>
                            <input type="email" placeholder="Enter your email" ref={emailRef} />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-solid fa-key"></i>
                            <input type={hideShow === "hide" ? "password" : "text"} placeholder="Enter your password" ref={passwordRef} />
                            {hideShow === "hide" ?
                                <i className="fa-regular fa-eye" onClick={() => setHideShow("show")}></i>
                                : <i className="fa-regular fa-eye-slash" onClick={() => setHideShow("hide")}></i>}
                        </div>
                        <div className={styles.inputButton}>
                            <input type="submit" value="Register" />
                        </div>
                        <div className={styles.switchMode}>
                            <p>Already have an account? <strong onClick={() => setMode("login")}>Login</strong></p>
                        </div>
                    </form> : ""}
                {mode === "login" ?
                    <form onSubmit={submitLogin}>
                        <div className={styles.header}>
                            {/* <h1>Welcome back!</h1> */}
                            <img src="/logoImage.png" alt="Image" />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-regular fa-envelope"></i>
                            <input type="email" placeholder="Enter your email" ref={emailRef} />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-solid fa-key"></i>
                            <input type={hideShow === "hide" ? "password" : "text"} placeholder="Enter your password" ref={passwordRef} />
                            {hideShow === "hide" ?
                                <i className="fa-regular fa-eye" onClick={() => setHideShow("show")}></i>
                                : <i className="fa-regular fa-eye-slash" onClick={() => setHideShow("hide")}></i>}
                        </div>
                        <div className={styles.forgotPass}>
                            <i onClick={() => setMode("forgotPassword")}>Forgot Password</i>
                        </div>
                        <div className={styles.inputButton}>
                            <input type="submit" value="Login" />
                        </div>
                        <div className={styles.switchMode}>
                            <p>Don't have an account? <strong onClick={() => setMode("register")}>Register</strong></p>
                        </div>
                    </form> : ""}
                {mode === "forgotPassword" ?
                    <form onSubmit={submitResetPassword}>
                        <div className={styles.header}>
                            {/* <h1>Reset Password</h1> */}
                            <img src="/logoImage.png" alt="Image" />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-regular fa-envelope"></i>
                            <input type="email" placeholder="Existing email" ref={emailRef} />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-solid fa-key"></i>
                            <input type="password" placeholder="New password" ref={passwordRef} />
                        </div>
                        <div className={styles.inputBox}>
                            <i className="fa-solid fa-key"></i>
                            <input type="password" placeholder="Confirm password" ref={confirmPasswordRef} />
                        </div>
                        <div className={styles.inputButton}>
                            <input type="submit" value="Reset" />
                        </div>
                        <div className={styles.switchMode}>
                            <p>Already have an account? <strong onClick={() => setMode("login")}>Login</strong></p>
                        </div>
                    </form> : ""}
            </div>
        </main>
    );
}
