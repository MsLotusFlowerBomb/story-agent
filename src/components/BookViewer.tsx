"use client";

import { useState, useEffect } from 'react';
import styles from './BookViewer.module.css';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export interface StoryPage {
    text: string;
    imageUrl?: string;
    chapterTitle?: string;
}

interface BookViewerProps {
    story: StoryPage[];
    apiKey?: string;
}

export default function BookViewer({ story, apiKey }: BookViewerProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const { speak, stop, isSpeaking } = useTextToSpeech(apiKey);

    const totalPages = story.length;
    const currentText = story[currentPage]?.text || story[currentPage]?.chapterTitle || "";

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleRead = () => {
        if (isSpeaking) {
            stop();
        } else {
            speak(currentText);
        }
    };

    // Stop speaking when page changes
    useEffect(() => {
        stop();
    }, [currentPage, stop]);

    return (
        <div>
            <div className={styles.bookContainer}>
                <div className={styles.book}>
                    {story.map((page, index) => {
                        const zIndex = totalPages - index;
                        const isFlipped = index < currentPage;

                        return (
                            <div
                                key={index}
                                className={`${styles.page} ${isFlipped ? styles.flipped : ''}`}
                                style={{ zIndex: zIndex }}
                            >
                                {index === 0 ? (
                                    <div className={styles.cover}>
                                        <h2>{page.chapterTitle || "My Story"}</h2>
                                        <p>A magical tale</p>
                                    </div>
                                ) : (
                                    <>
                                        {page.imageUrl && <img src={page.imageUrl} className={styles.pageImage} alt="Illustration" />}
                                        <h3>{page.chapterTitle}</h3>
                                        <p className={styles.pageText}>{page.text}</p>
                                        <span className={styles.pageNum}>{index}</span>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.controls}>
                <button className={styles.navBtn} onClick={handlePrev} disabled={currentPage === 0}>
                    ← Previous
                </button>

                <button
                    className={styles.readBtn}
                    onClick={handleRead}
                    style={{ background: isSpeaking ? '#ef4444' : '#3b82f6' }}
                >
                    {isSpeaking ? '🤫 Stop' : '🔊 Read to Me'}
                </button>

                <div style={{ color: 'white', alignSelf: 'center' }}>
                    Page {currentPage} / {totalPages - 1 || 0}
                </div>
                <button className={styles.navBtn} onClick={handleNext} disabled={currentPage === totalPages - 1}>
                    Next →
                </button>
            </div>
        </div>
    );
}
