import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text, key, provider } = await req.json();

        // 1. ElevenLabs (Highest Quality)
        const elevenKey = process.env.ELEVENLABS_API_KEY;
        if (elevenKey && (provider === 'elevenlabs' || !key)) { // Prefer ElevenLabs if available on server
            try {
                // Voice ID: 21m00Tcm4TlvDq8ikWAM (Rachel)
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
                    method: 'POST',
                    headers: {
                        'xi-api-key': elevenKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: "eleven_monolingual_v1",
                        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                    }),
                });

                if (!response.ok) throw new Error(await response.text());

                const arrayBuffer = await response.arrayBuffer();
                return new NextResponse(arrayBuffer, {
                    headers: { 'Content-Type': 'audio/mpeg' },
                });
            } catch (error) {
                console.error("ElevenLabs Failed:", error);
                // Fallthrough to OpenAI or error
            }
        }

        // 2. OpenAI (High Quality)
        // Resolve Keys (Request Body > Environment Variables)
        const openAIKey = key || process.env.OPENAI_API_KEY;

        if (!openAIKey) {
            return NextResponse.json({ error: 'Missing OpenAI API Key' }, { status: 401 });
        }

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: 'nova', // Creating a cheerful, conversational persona
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error: error.error?.message || 'OpenAI API Error' }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('TTS Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
