"use client";

import { StoryPage } from "@/components/BookViewer";

export interface SavedStory {
    id: string;
    title: string;
    author: string; // "AI" or BookDash Author
    coverImage: string;
    pages: StoryPage[];
    createdAt: number;
    source: 'generated' | 'bookdash';
}

const DB_KEY = "story_sparks_library";

export const StoryDB = {
    getAll: (): SavedStory[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(DB_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data).sort((a: SavedStory, b: SavedStory) => b.createdAt - a.createdAt);
        } catch (e) {
            console.error("Failed to parse library", e);
            return [];
        }
    },

    save: (story: SavedStory) => {
        if (typeof window === 'undefined') return;
        const stories = StoryDB.getAll();
        // Check for duplicates by ID
        const existingIndex = stories.findIndex(s => s.id === story.id);
        if (existingIndex >= 0) {
            // Update existing (move to top)
            stories.splice(existingIndex, 1);
        }
        stories.unshift(story);
        localStorage.setItem(DB_KEY, JSON.stringify(stories));
    },

    delete: (id: string) => {
        if (typeof window === 'undefined') return;
        const stories = StoryDB.getAll().filter(s => s.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(stories));
    },

    // Check if a BookDash story is already downloaded
    isDownloaded: (id: string): boolean => {
        const stories = StoryDB.getAll();
        return stories.some(s => s.id === id);
    }
};
