"use client";

import { useState, useEffect } from "react";
import MagicInput from "@/components/MagicInput";
import BookViewer, { StoryPage } from "@/components/BookViewer";
import SettingsModal from "@/components/SettingsModal";
import LibraryModal from "@/components/LibraryModal";
import AgentStatus, { AgentMessage } from "@/components/AgentStatus";
import Sparky from "@/components/Sparky";
import suggestionStyles from "@/components/StorySuggestions.module.css";
import DailyGoal from "@/components/DailyGoal";
import BookDashLibrary from "@/components/BookDashLibrary";
import LibraryShelf from "@/components/LibraryShelf";
import { BOOKDASH_LIBRARY } from "@/data/bookdash_library";
import { StoryDB, SavedStory } from "@/lib/db";
import styles from "./page.module.css";

// Initial dummy story for testing visual immediately
const DUMMY_STORY: StoryPage[] = [
  { text: "", chapterTitle: "The Magical Quest" }, // Cover
];

export default function Home() {
  const [story, setStory] = useState<StoryPage[]>(DUMMY_STORY);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [apiKeys, setApiKeys] = useState({ geminiKey: "", hfKey: "", openaiKey: "" });
  const [libraryStories, setLibraryStories] = useState<SavedStory[]>([]);
  const [dummyState, setDummyState] = useState(0); // Force re-render for library updates

  useEffect(() => {
    const savedKeys = localStorage.getItem("storySparks_keys");
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error("Failed to parse keys", e);
      }
    }
    // Load Library
    setLibraryStories(StoryDB.getAll());
  }, [dummyState]);

  const refreshLibrary = () => setDummyState(prev => prev + 1);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setAgentMessages([]); // Reset messages

    try {
      // Note: We used to block here if !apiKeys.geminiKey, but now we let the server
      // handle it in case environment variables are set on the server side.


      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, keys: apiKeys })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to start magic");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last part which might be incomplete in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;
            try {
              const data = JSON.parse(line);
              if (data.type === 'status') {
                setAgentMessages(prev => [...prev, { agent: data.agent, message: data.message }]);
                setStory(data.story);

                // Auto-Save the created story
                const newStory: SavedStory = {
                  id: crypto.randomUUID(),
                  title: `The Story of ${prompt.substring(0, 20)}...`, // Temporary title
                  author: "AI Storyteller",
                  coverImage: data.story[0]?.imageUrl || "https://placehold.co/400x600",
                  pages: data.story,
                  createdAt: Date.now(),
                  source: 'generated'
                };
                StoryDB.save(newStory);
                refreshLibrary();

                setTimeout(() => setHasGenerated(true), 1000);
              } else if (data.type === 'error') {
                alert("Agent Error: " + data.message);
              }
            } catch (e) {
              console.error("Error parsing stream line", e, line);
            }
          }
        }
      }

    } catch (e: any) {
      console.error(e);
      alert(e.message || "Oh no! The magic spell fizzled out. Try again!");
      if (e.message?.includes("Missing Gemini API Key")) {
        setIsSettingsOpen(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.magicFrame}>
        <header className={styles.header}>
          <div className={styles.logo}>✨ StorySparks</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setIsLibraryOpen(true)} className={styles.settingsBtn} style={{ background: 'var(--color-accent-gold)' }}>
              📚 Library
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className={styles.settingsBtn}>
              ⚙️ Settings
            </button>
          </div>
        </header>



        <div className={styles.content}>
          {!hasGenerated ? (
            <div className={styles.hero}>
              <h1 className={styles.title}>Where Magic Stories Begin</h1>
              <p className={styles.subtitle}>
                Tell us about a hero, a dragon, or a lost toy, and watch the magic happen!
              </p>

              <div style={{ margin: '2rem 0' }}>

                {/* My Library (Saved & Downloaded) */}
                <LibraryShelf
                  stories={libraryStories}
                  onSelectStory={(story) => {
                    setStory(story.pages);
                    setHasGenerated(true);
                  }}
                  onDeleteStory={(id) => {
                    StoryDB.delete(id);
                    refreshLibrary();
                  }}
                />

                {/* BookDash Store (Downloadable Content) */}
                <br />
                <BookDashLibrary
                  books={BOOKDASH_LIBRARY}
                  onSelectBook={(book) => {
                    // 1. Save to Library (Download)
                    const newDownload: SavedStory = {
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      coverImage: book.coverImage,
                      pages: book.pages,
                      createdAt: Date.now(),
                      source: 'bookdash'
                    };
                    StoryDB.save(newDownload);
                    refreshLibrary();

                    // 2. Open
                    setStory(book.pages);
                    setHasGenerated(true);
                  }}
                />

                <MagicInput onGenerate={handleGenerate} isGenerating={isGenerating} />
              </div>

              {!isGenerating && (
                <div className={styles.dashboardGrid}>
                  {/* Left Suggestions */}
                  <div className={suggestionStyles.column}>
                    <div className={suggestionStyles.card} onClick={() => handleGenerate("A dragon who loves baking cookies")}>
                      <span className={suggestionStyles.icon}>🐉</span>
                      <h4 className={suggestionStyles.title}>The Baking Dragon</h4>
                    </div>
                    <div className={suggestionStyles.card} onClick={() => handleGenerate("A robot helping a lost kitten in space")}>
                      <span className={suggestionStyles.icon}>🤖</span>
                      <h4 className={suggestionStyles.title}>Space Rescue</h4>
                    </div>
                  </div>

                  {/* Center Ring */}
                  <div className={suggestionStyles.center}>
                    <DailyGoal />
                  </div>

                  {/* Right Suggestions */}
                  <div className={suggestionStyles.column}>
                    <div className={suggestionStyles.card} onClick={() => handleGenerate("A magical tree that grows toys")}>
                      <span className={suggestionStyles.icon}>🌳</span>
                      <h4 className={suggestionStyles.title}>The Toy Tree</h4>
                    </div>
                    <div className={suggestionStyles.card} onClick={() => handleGenerate("A superhero with a cape made of clouds")}>
                      <span className={suggestionStyles.icon}>🦸</span>
                      <h4 className={suggestionStyles.title}>Cloud Hero</h4>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Status would go here if generating... */}


              {/* Agent Status */}
              {isGenerating && (
                <div style={{ marginTop: '2rem' }}>
                  <AgentStatus messages={agentMessages} />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.bookWrapper}>
              <button onClick={() => setHasGenerated(false)} className={styles.backBtn}>
                ← Make Another Story
              </button>
              <BookViewer story={story} apiKey={apiKeys.openaiKey} />
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialKeys={apiKeys}
        onSave={(keys) => {
          setApiKeys(keys);
          localStorage.setItem("storySparks_keys", JSON.stringify(keys));
          setIsSettingsOpen(false);
        }}
      />

      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectStory={(selectedStory) => {
          setStory(selectedStory);
          setHasGenerated(true);
        }}
      />

      <Sparky status={isGenerating ? 'generating' : hasGenerated ? 'reading' : 'idle'} />
    </main>
  );
}
