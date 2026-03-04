
"use client";
import "../globals.css";
import styles from "../../styles/DashboardLayout/layout/page.module.css";
// import Sidebar from "../dashboard/sidebar/sidebar";
import AdminSidebar from "./sidebar/adminSidebar";

export default function Admin({ children }) {
  return (
    <main className={styles.main}>
      <div className={styles.sidenavbar}>
        <AdminSidebar />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );
}


