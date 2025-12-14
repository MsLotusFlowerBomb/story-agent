import { useState, useRef, useCallback } from 'react';

export function useTextToSpeech(apiKey?: string) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const stop = useCallback(() => {
        // Stop Audio API
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        // Stop Browser API
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const speak = useCallback(async (text: string) => {
        if (!text) return;
        stop();
        setIsSpeaking(true);

        // 1. Try API first (ElevenLabs or OpenAI)
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, key: apiKey, provider: 'elevenlabs' }), // Request top quality
            });

            if (!response.ok) throw new Error('TTS Failed or No Key');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();
            return; // Success, skip fallback
        } catch (error) {
            console.warn("API TTS Failed, falling back to browser.", error);
            // Continue to fallback...
        }

        // 2. Fallback to Browser native (Optimized)
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1.1;

        // Attempt to select a better voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Microsoft Zira") ||
            (v.lang === 'en-US' && !v.name.includes("Microsoft David")) // Avoid robotic David
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [apiKey, stop]);

    return { speak, stop, isSpeaking };
}
