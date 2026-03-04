// socket.js
import { io } from "socket.io-client";

let socket;

export default function getSocket(){
  if (!socket) socket = io("http://localhost:9876", { withCredentials: true });
  return socket;
};
