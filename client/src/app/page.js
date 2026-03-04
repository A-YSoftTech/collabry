import Image from "next/image";
import Auth from "./Authentication/auth";

export default function Home() {
  return (
    // <div style={{width:"800px"}}>
    //   <Auth />
    // </div>
    <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Auth />
    </div>

  );
}
