import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const PERSONA = `You are a cheerful and imaginative children's story author known for creating heartwarming tales that captivate children aged 6-11. Your ultimate goal is to craft delightful stories that spark joy, wonder, and imagination in young readers, while also subtly teaching valuable lessons.`;

const GUIDELINES = `Writing Guidelines for Children Aged 6-11:
Keep the language simple, clear, and engaging, with a vocabulary that is easy for children aged 6-11 to understand but also introduces new, age-appropriate words. Focus on bright descriptions and relatable, fun characters. Ensure sentence structures are varied but generally straightforward. The plot should be simple yet intriguing, with a clear beginning, middle, and end, leading to a happy or satisfying resolution that reinforces positive values like kindness, courage, curiosity, and friendship. The story should be around 150-200 words per section (condensed for web generation speed), making it manageable for this age group. Incorporate the main character's name and the chosen theme throughout the narrative in an accessible way. Always aim to deliver a wholesome and educational message without being overly preachy. Remember to make it fun and exciting for young adventurers!`;

export class StoryAgent {
    protected model: GenerativeModel;

    constructor(apiKey: string) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        this.model = genAI.getGenerativeModel({ model: modelName });
    }
}

export class PremiseAgent extends StoryAgent {
    async generate(topic: string): Promise<string> {
        const prompt = `
        ${PERSONA}
        
        Write a single-sentence premise for a children's story about: "${topic}".
        
        ${GUIDELINES}
        `;
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
    }
}

export class OutlineAgent extends StoryAgent {
    async generate(premise: string): Promise<string> {
        const prompt = `
        ${PERSONA}
        
        You have a heartwarming premise in mind:
        "${premise}"
        
        Write a simple, engaging 5-chapter outline for the plot of your children's story, focusing on positive messages and clear progression.
        
        ${GUIDELINES}
        `;
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
    }
}

export class WriterAgent extends StoryAgent {
    async generate(premise: string, outline: string): Promise<string> {
        const prompt = `
        ${PERSONA}
        
        You have a heartwarming premise in mind:
        "${premise}"
        
        And here is the outline:
        ${outline}
        
        Now, write the full 5-chapter story based on this outline.
        
        Return STRICT JSON format with this schema:
        [
          { "chapterTitle": "Chapter 1: Title", "text": "Full text of chapter...", "imagePrompt": "A cute illustration of..." },
          ...
        ]
        
        - "text": Follow the writing guidelines. Engaging, clear, and around 150-200 words per chapter.
        - "imagePrompt": Descriptive for an AI image generator (e.g. "A vibrant, sunny forest scene... Pip has a curious and happy expression").
        
        ${GUIDELINES}
        `;
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
    }
}
