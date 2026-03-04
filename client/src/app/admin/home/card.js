
"use client";
import styles from "../../../styles/admin/card/page.module.css"
export default function Card({head, quantity}) {
  return (
    <main className={styles.container}>
      <h1>{head}</h1>
      <p>{quantity}</p>
    </main>
  );
}


