"use client";

import { useState } from 'react';
import styles from './MagicInput.module.css';

interface MagicInputProps {
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
}

export default function MagicInput({ onGenerate, isGenerating }: MagicInputProps) {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isGenerating) {
            onGenerate(prompt);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.inputWrapper}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Once upon a time, there was a..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                />
                <button type="submit" className={styles.sparkleBtn} disabled={isGenerating}>
                    {isGenerating ? '🌟' : '🪄'}
                </button>
            </form>
            <div className={styles.suggestion}>
                Try: "A brave toaster who loves toast" or "A cat who can fly"
            </div>
        </div>
    );
}
