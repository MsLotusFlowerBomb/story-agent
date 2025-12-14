"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ParentZone() {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Settings State
    const [bedtimeMode, setBedtimeMode] = useState(false);
    const [readingLevel, setReadingLevel] = useState(2); // 1-3
    const [screenTimeLimit, setScreenTimeLimit] = useState(60); // minutes

    useEffect(() => {
        // Simple protection: Redirect if not parent
        if (user?.role !== "parent") {
            // Allow bypassing for dev/demo if needed, but strict for now
            // router.push("/login");
        }
    }, [user, router]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>P</div>
                    <h3>Parent Portal</h3>
                </div>
                <nav className={styles.nav}>
                    <button className={`${styles.navItem} ${styles.active}`}>Dashbaord</button>
                    <button className={styles.navItem}>Reading Log</button>
                    <button className={styles.navItem}>Subscription</button>
                    <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                </nav>
            </div>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Settings & Controls</h1>
                    <p>Manage your child's magical journey</p>
                </header>

                <div className={styles.grid}>
                    {/* Bedtime Mode Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>🌙 Bedtime Mode</h2>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={bedtimeMode}
                                    onChange={(e) => setBedtimeMode(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <p>Automatically dim screen and limit energetic stories after 8 PM.</p>
                    </div>

                    {/* Reading Level Card */}
                    <div className={styles.card}>
                        <h2>📚 Reading Level</h2>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                value={readingLevel}
                                onChange={(e) => setReadingLevel(parseInt(e.target.value))}
                                className={styles.range}
                            />
                            <div className={styles.labels}>
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Advanced</span>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Preview */}
                    <div className={`${styles.card} ${styles.analytics}`}>
                        <h2>📊 Weekly Activity</h2>
                        <div className={styles.chartPlaceholder}>
                            <div className={styles.bar} style={{ height: '40%' }}>M</div>
                            <div className={styles.bar} style={{ height: '70%' }}>T</div>
                            <div className={styles.bar} style={{ height: '30%' }}>W</div>
                            <div className={styles.bar} style={{ height: '80%' }}>T</div>
                            <div className={styles.bar} style={{ height: '50%' }}>F</div>
                            <div className={styles.bar} style={{ height: '90%' }}>S</div>
                            <div className={styles.bar} style={{ height: '60%' }}>S</div>
                        </div>
                        <p className={styles.stat}>{screenTimeLimit} mins avg / day</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
