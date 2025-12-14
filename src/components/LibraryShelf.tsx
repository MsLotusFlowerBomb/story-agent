"use client";

import styles from './BookDashLibrary.module.css'; // Reusing the excellent styles
import { SavedStory } from '@/lib/db';

interface LibraryShelfProps {
    stories: SavedStory[];
    onSelectStory: (story: SavedStory) => void;
    onDeleteStory: (id: string, e: React.MouseEvent) => void;
}

export default function LibraryShelf({ stories, onSelectStory, onDeleteStory }: LibraryShelfProps) {
    if (stories.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>❤️ My Library</h3>
            <p className={styles.subheading}>Your collection of magical tales.</p>

            <div className={styles.scrollRow}>
                {stories.map((story) => (
                    <div
                        key={story.id}
                        className={styles.bookCard}
                        onClick={() => onSelectStory(story)}
                    >
                        <div className={styles.coverWrapper}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={story.coverImage} alt={story.title} className={styles.coverImage} />
                            <div className={styles.overlay}>
                                <span className={styles.playIcon}>▶</span>
                            </div>
                            {/* Type Badge */}
                            <div style={{
                                position: 'absolute', top: 5, right: 5,
                                background: story.source === 'generated' ? '#FFD700' : '#4ECDC4',
                                padding: '2px 6px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 'bold', color: 'black'
                            }}>
                                {story.source === 'generated' ? 'AI' : 'BOOK'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h4 className={styles.bookTitle} style={{ maxWidth: '120px' }}>{story.title}</h4>
                                <span className={styles.author}>by {story.author}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteStory(story.id, e); }}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: '1rem', marginTop: '0.5rem'
                                }}
                                title="Remove from Library"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
