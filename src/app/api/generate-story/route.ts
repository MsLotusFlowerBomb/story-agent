import { NextResponse } from "next/server";
import { PremiseAgent, OutlineAgent, WriterAgent } from "@/lib/agents";

// Helper to send data chunks
function sendChunk(controller: ReadableStreamDefaultController, data: any) {
    controller.enqueue(new TextEncoder().encode(JSON.stringify(data) + "\n"));
}

interface StoryChapter {
    chapterTitle: string;
    text: string;
    imagePrompt: string;
    imageUrl?: string;
}

export async function POST(req: Request) {
    try {
        const { prompt, keys } = await req.json();

        // Resolve Keys (Request Body > Environment Variables)
        const geminiKey = keys?.geminiKey || process.env.GOOGLE_API_KEY;
        const hfKey = keys?.hfKey || process.env.HF_API_KEY;

        if (!geminiKey) {
            return NextResponse.json({ error: "Missing Gemini API Key. Please add it in Settings or .env file (GEMINI_API_KEY or GOOGLE_API_KEY)." }, { status: 400 });
        }

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // --- Agent 1: Premise ---
                    sendChunk(controller, { type: "status", agent: "✨ Premise Agent", message: "Brainstorming a magical idea..." });
                    const premiseAgent = new PremiseAgent(geminiKey);
                    const premise = await premiseAgent.generate(prompt);
                    sendChunk(controller, { type: "status", agent: "✨ Premise Agent", message: `Idea: ${premise}` });

                    // --- Agent 2: Outline ---
                    sendChunk(controller, { type: "status", agent: "📝 Outline Agent", message: "Structuring the adventure..." });
                    const outlineAgent = new OutlineAgent(geminiKey);
                    const outline = await outlineAgent.generate(premise);
                    sendChunk(controller, { type: "status", agent: "📝 Outline Agent", message: "Outline created!" });

                    // --- Agent 3: Writer ---
                    sendChunk(controller, { type: "status", agent: "📖 Writer Agent", message: "Writing the story chapters..." });
                    const writerAgent = new WriterAgent(geminiKey);
                    const storyJson = await writerAgent.generate(premise, outline);

                    // Clean up JSON: reliably find the start and end of the JSON array
                    const firstBracket = storyJson.indexOf("[");
                    const lastBracket = storyJson.lastIndexOf("]");

                    let storyData: StoryChapter[] = [];
                    if (firstBracket !== -1 && lastBracket !== -1) {
                        const jsonString = storyJson.substring(firstBracket, lastBracket + 1);
                        try {
                            storyData = JSON.parse(jsonString);
                        } catch (e) {
                            console.error("JSON Parse Error. Raw:", storyJson);
                            sendChunk(controller, { type: "error", message: "Failed to parse story data." });
                            controller.close();
                            return;
                        }
                    } else {
                        console.error("No JSON array found in response:", storyJson);
                        sendChunk(controller, { type: "error", message: "AI didn't return a valid story format." });
                        controller.close();
                        return;
                    }

                    // --- Agent 4: Illustrator (Parallel) ---
                    sendChunk(controller, { type: "status", agent: "🎨 Illustrator Agent", message: "Painting the scenes..." });

                    const storyWithImages = await Promise.all(storyData.map(async (chapter: StoryChapter, index: number) => {
                        let imageUrl = `https://placehold.co/600x400/png?text=Chapter+${index + 1}`;

                        // Check if key is real, not just the placeholder text
                        const hasRealHfKey = hfKey && !hfKey.includes("PASTE_HERE") && !hfKey.includes("PASTE_YOUR");

                        if (hasRealHfKey) {
                            try {
                                const imgRes = await fetch(
                                    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
                                    {
                                        headers: { Authorization: `Bearer ${hfKey}` },
                                        method: "POST",
                                        body: JSON.stringify({ inputs: chapter.imagePrompt }),
                                    }
                                );

                                if (imgRes.ok) {
                                    const blob = await imgRes.blob();
                                    const arrayBuffer = await blob.arrayBuffer();
                                    const buffer = Buffer.from(arrayBuffer);
                                    const base64 = buffer.toString('base64');
                                    imageUrl = `data:image/jpeg;base64,${base64}`;
                                } else {
                                    console.error("Image gen failed (HF), falling back to Pollinations:", await imgRes.text());
                                    // Fallback to Pollinations inside error
                                    const encodedPrompt = encodeURIComponent(chapter.imagePrompt + " children book illustration, cute, vibrant");
                                    imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
                                }
                            } catch (err) {
                                console.error("Image generation failed (HF Exception), using fallback", err);
                                // Fallback to Pollinations inside catch
                                const encodedPrompt = encodeURIComponent(chapter.imagePrompt + " children book illustration, cute, vibrant");
                                imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
                            }
                        } else {
                            // No valid key? Use Pollinations.ai (Free, High Quality)
                            const encodedPrompt = encodeURIComponent(chapter.imagePrompt + " children book illustration, cute, vibrant");
                            imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
                        }
                        return { ...chapter, imageUrl };
                    }));

                    // Add Cover
                    const finalStory = [
                        {
                            chapterTitle: "The Story of " + prompt,
                            text: `Based on the premise: ${premise}`,
                            imagePrompt: "Cover image",
                            imageUrl: storyWithImages[0]?.imageUrl
                        },
                        ...storyWithImages
                    ];

                    // Send Final Result
                    sendChunk(controller, { type: "result", story: finalStory });
                    controller.close();

                } catch (error: any) {
                    console.error(error);
                    sendChunk(controller, { type: "error", message: error.message || "Something went wrong in the agent workflow." });
                    controller.close();
                }
            }
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
