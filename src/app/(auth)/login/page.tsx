"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function LoginPage() {
    const { login } = useAuth();
    const [name, setName] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            login(name, "kid");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back! 👋</h1>
                <p className={styles.subtitle}>Enter the Magic World</p>

                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="text"
                        placeholder="What's your name?"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className={styles.btn}>Blast Off! 🚀</button>

                    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
                        <button
                            type="button"
                            className={styles.parentBtn}
                            onClick={() => login("Parent", "parent")}
                        >
                            Parent Login 🔒
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
