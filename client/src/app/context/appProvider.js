"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [owner, setOwner] = useState(null);
    const router = useRouter();
    const [chatType, setChatType] = useState("text");
    const [sharePostId, setSharePostId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [relationship, setRelationship] = useState({});
    const [acceptRequest, setAcceptRequest] = useState({});

    const [sendRequest, setSendRequest] = useState([]);
    const [receiveRequest, setReceiveRequest] = useState([]);
    const [chatRequest, setchatRequest] = useState([]);

    const myDetail = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/myDetails`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            const data = await response.json();
            if (!response.ok) {
                return;
            }

            // console.log("Login details :", data);
            setOwner(data.detail);
        } catch (error) {
            toast.error(error.message);
        }
    }
    const checkFriendStatus = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/checkFriendStatus`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            const data = await response.json();
            if (!response.ok) {
                return;
            }

            console.log("friendStatus :", data.friendRequest);
            const map = {};
            const accept = {};
            data.friendRequest.forEach(req => {
                map[req.userId] = req.status;
                accept[req.ownerId] = req.status;
            });
            setRelationship(map);
            setAcceptRequest(accept);
        } catch (error) {
            console.log("status error = ", error);
            toast.error(error.message);
        }
    }
    useEffect(() => {

        const initialize = async () => {

            await myDetail();

            await checkFriendStatus();
            await chatNotification();
            await requestNotification();

            setLoading(false);

        };

        initialize();

    }, []);
    const sendFriendRequest = async (friendId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/sendFriendRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ friendId })
            });

            const result = await res.json();
            if (!res.ok) {
                console.log("response error = ", result.token);
                if (result.token === false) {
                    router.push("/");
                }
                toast.error(result.message);
                return;
            }

            // console.log("friend request =", result);
            toast.success(result.message);
            checkFriendStatus();
        } catch (error) {
            toast.error(error.message);
        }
    };
    const chatNotification = async () => {
        try {
            const response = await fetch("http://localhost:9876/chatNotification", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
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
            // console.log("chat notify = ", data);
            const uniqueChats = Array.from(
                new Map(
                    data.messages.map(msg => [msg.senderId._id, msg])
                ).values()
            );

            setchatRequest(uniqueChats);
            // setchatRequest(data.messages);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.message);
        }
    }
    const requestNotification = async () => {
        try {
            const response = await fetch("http://localhost:9876/notification", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
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
            setSendRequest(data.sendRequest);
            setReceiveRequest(data.receiveRequest);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.message);
        }
    }
    const checkFunction = (text) => {
        console.log("usecontext = ", text)
    }

    return (
        <AppContext.Provider value={{
            checkFunction,
            owner, loading, relationship, acceptRequest, sendFriendRequest,
            sendRequest, receiveRequest, chatRequest, requestNotification, chatNotification,
            chatType, setChatType, sharePostId, setSharePostId
        }}>
            {children}
        </AppContext.Provider>
    )
}