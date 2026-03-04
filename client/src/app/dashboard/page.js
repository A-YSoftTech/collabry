"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      toast.error("Token expired");
      router.push("/");
    }else{
      router.push("/dashboard/main");
    }
  },[router]);
  return (
    <main>
        dashboard
    </main>
  );
}

