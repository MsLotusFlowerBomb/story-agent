"use client";

import styles from './BookDashLibrary.module.css';
import { BookDashBook } from '@/data/bookdash_library';

interface BookDashLibraryProps {
    books: BookDashBook[];
    onSelectBook: (book: BookDashBook) => void;
}

export default function BookDashLibrary({ books, onSelectBook }: BookDashLibraryProps) {
    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>📚 Read Instantly (Virtual Library)</h3>
            <p className={styles.subheading}>Already downloaded and ready to read!</p>

            <div className={styles.scrollRow}>
                {books.map((book) => (
                    <div
                        key={book.id}
                        className={styles.bookCard}
                        onClick={() => onSelectBook(book)}
                    >
                        <div className={styles.coverWrapper}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={book.coverImage} alt={book.title} className={styles.coverImage} />
                            <div className={styles.overlay}>
                                <span className={styles.playIcon}>▶</span>
                            </div>
                        </div>
                        <h4 className={styles.bookTitle}>{book.title}</h4>
                        <span className={styles.author}>by {book.author}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
