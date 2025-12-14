"use client";

import { useState, useEffect } from "react";
import styles from "./Sparky.module.css";

interface SparkyProps {
    status?: 'idle' | 'generating' | 'reading';
}

export default function Sparky({ status = 'idle' }: SparkyProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("Hi! I'm Sparky! ✨");
    const [isTalking, setIsTalking] = useState(false);

    // React to status changes
    useEffect(() => {
        if (status === 'generating') {
            setMessage("Waving my magic wand... ✨");
            setIsOpen(true);
            setIsTalking(true);
        } else if (status === 'reading') {
            setMessage("Shh... it's story time! 📖");
            setIsOpen(true);
            setTimeout(() => setIsOpen(false), 3000); // Hide after a bit
        } else {
            setIsTalking(false);
        }
    }, [status]);

    // Simple interaction logic
    const handlePoke = () => {
        setIsTalking(true);
        const sayings = [
            "Ready to write a story?",
            "I love magic!",
            "What happened next?",
            "You are a great writer!",
            "Need a hint? Try a dragon!"
        ];

        let random = sayings[Math.floor(Math.random() * sayings.length)];

        // Context aware pokes
        if (status === 'generating') {
            random = "Brewing up some imagination...";
        } else if (status === 'reading') {
            random = "I love this part!";
        }

        setMessage(random);
        setIsOpen(true);

        // Auto-close after a few seconds
        setTimeout(() => setIsTalking(false), 2000);
        setTimeout(() => setIsOpen(false), 5000);
    };

    return (
        <div className={styles.container}>
            {isOpen && (
                <div className={`${styles.bubble} ${styles.fadeIn}`}>
                    {message}
                </div>
            )}
            <div
                className={`${styles.robot} ${isTalking ? styles.bounce : ''}`}
                onClick={handlePoke}
                onMouseEnter={() => setIsOpen(true)}
            >
                🤖
                <div className={styles.glow}></div>
            </div>
        </div>
    );
}
