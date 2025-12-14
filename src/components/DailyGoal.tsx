"use client";

import { useState, useEffect } from "react";
import styles from "./DailyGoal.module.css";

export default function DailyGoal() {
    // Mock data for prototype
    const targetProgress = 75;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setProgress(targetProgress), 100);
        return () => clearTimeout(timer);
    }, []);

    const radius = 60;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={styles.container}>
            <div className={styles.ringWrapper}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className={styles.svg}
                >
                    <circle
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="var(--color-accent-gold)"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{
                            strokeDashoffset,
                            transition: 'stroke-dashoffset 1s ease-in-out'
                        }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={styles.progressRing}
                    />
                </svg>
                <div className={styles.content}>
                    <span className={styles.icon}>🚀</span>
                </div>
            </div>
            <div className={styles.label}>
                <h3>Daily Magic Goal</h3>
                <p>75% Complete</p>
            </div>
        </div>
    );
}
