"use client";

import { useState, useEffect } from 'react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (keys: { geminiKey: string; hfKey: string; openaiKey: string }) => void;
    initialKeys: { geminiKey: string; hfKey: string; openaiKey: string };
}

export default function SettingsModal({ isOpen, onClose, onSave, initialKeys }: SettingsModalProps) {
    const [keys, setKeys] = useState(initialKeys);

    useEffect(() => {
        setKeys(initialKeys);
    }, [initialKeys, isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>⚙️ Magic Keys Configuration</h2>

                <div className={styles.field}>
                    <label className={styles.label}>Google Gemini API Key</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={keys.geminiKey}
                        onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                        placeholder="AIza..."
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>HuggingFace API Key (for Images)</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={keys.hfKey}
                        onChange={(e) => setKeys({ ...keys, hfKey: e.target.value })}
                        placeholder="hf_..."
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>OpenAI API Key (for Natural Voice) 🗣️</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={keys.openaiKey}
                        onChange={(e) => setKeys({ ...keys, openaiKey: e.target.value })}
                        placeholder="sk-..."
                    />
                </div>

                <div className={styles.actions}>
                    <button onClick={onClose} className={`${styles.btn} ${styles.btnCancel}`}>Cancel</button>
                    <button onClick={() => onSave({ ...keys, openaiKey: keys.openaiKey })} className={`${styles.btn} ${styles.btnSave}`}>Save Keys</button>
                </div>
            </div>
        </div>
    );
}
