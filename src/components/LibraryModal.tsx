"use client";

import styles from "./LibraryModal.module.css";
import { StoryPage } from "./BookViewer";

// STATIC LIBRARY DATA
// In a real app, this could come from a database or API
const LIBRARY_BOOKS = [
    {
        id: "velveteen-rabbit",
        title: "The Velveteen Rabbit",
        author: "Margery Williams",
        coverImage: "https://placehold.co/300x400/png?text=Velveteen+Rabbit",
        story: [
            {
                text: "There was once a velveteen rabbit, and in the beginning he was really splendid. He was fat and bunchy, as a rabbit should be; his coat was spotted brown and white, he had real thread whiskers, and his ears were lined with pink sateen.",
                chapterTitle: "Chapter 1: The New Toy",
                imageUrl: "https://placehold.co/600x400/png?text=The+Velveteen+Rabbit"
            },
            {
                text: "For a long time he lived in the toy cupboard or on the nursery floor, and no one thought very much about him. He was naturally shy, and being only made of velveteen, some of the more expensive toys quite snubbed him.",
                chapterTitle: "Chapter 2: In the Nursery",
                imageUrl: "https://placehold.co/600x400/png?text=In+the+Nursery"
            },
            {
                text: "\"Real isn't how you are made,\" said the Skin Horse. \"It's a thing that happens to you. When a child loves you for a long, long time, not just to play with, but REALLY loves you, then you become Real.\"",
                chapterTitle: "Chapter 3: Becoming Real",
                imageUrl: "https://placehold.co/600x400/png?text=Becoming+Real"
            }
        ]
    },
    {
        id: "secret-garden",
        title: "The Secret Garden",
        author: "Frances Hodgson Burnett",
        coverImage: "https://placehold.co/300x400/png?text=Secret+Garden",
        story: [
            {
                text: "When Mary Lennox was sent to Misselthwaite Manor to live with her uncle everybody said she was the most disagreeable-looking child ever seen. It was true, too. She had a little thin face and a little thin body, thin light hair and a sour expression.",
                chapterTitle: "Chapter 1: There Is No One Left",
                imageUrl: "https://placehold.co/600x400/png?text=Mistress+Mary"
            },
            {
                text: "She went out into the garden as quickly as possible, and the first thing she did was to run round and round the fountain flower garden ten times. She counted the times carefully and when she had finished she felt in better spirits.",
                chapterTitle: "Chapter 2: The Garden",
                imageUrl: "https://placehold.co/600x400/png?text=The+Garden"
            }
        ]
    }
];

interface LibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectStory: (story: StoryPage[]) => void;
}

export default function LibraryModal({ isOpen, onClose, onSelectStory }: LibraryModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>📚 Magical Library</h2>
                    <button onClick={onClose} className={styles.closeBtn}>Close ✖</button>
                </div>

                <div className={styles.grid}>
                    {LIBRARY_BOOKS.map((book) => (
                        <div
                            key={book.id}
                            className={styles.bookCard}
                            onClick={() => {
                                onSelectStory(book.story);
                                onClose();
                            }}
                        >
                            <img src={book.coverImage} alt={book.title} className={styles.cover} />
                            <h3 className={styles.bookTitle}>{book.title}</h3>
                            <p className={styles.author}>{book.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
