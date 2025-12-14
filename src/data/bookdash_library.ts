import { StoryPage } from "@/components/BookViewer";

export interface BookDashBook {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    pages: StoryPage[];
}

export const BOOKDASH_LIBRARY: BookDashBook[] = [
    {
        id: "bd-1",
        title: "Rafiki's Style",
        author: "Zintle Nkohla",
        coverImage: "https://image.pollinations.ai/prompt/cute%20cartoon%20girl%20Rafiki%20wearing%20cool%20sunglasses%20and%20hat,%20bright%20colors,%20children%20book%20cover?width=400&height=600&nologo=true",
        pages: [
            {
                chapterTitle: "Rafiki's Style",
                text: "Rafiki's family were getting ready to go to the park. Everyone was wearing their Sunday best. Rafiki wanted to look special!",
                imageUrl: "https://image.pollinations.ai/prompt/african%20family%20getting%20dressed%20fancy,%20cute%20cartoon%20style?width=800&height=600&nologo=true"
            },
            {
                chapterTitle: "The Coolest Girl",
                text: "Rafiki wanted to look cool. She put on her favourite hat and her bright pink sunglasses. 'Now I am ready!' she shouted with a big smile.",
                imageUrl: "https://image.pollinations.ai/prompt/cute%20little%20girl%20wearing%20pink%20sunglasses%20and%20hat,%20happy?width=800&height=600&nologo=true"
            },
            {
                chapterTitle: "At the Park",
                text: "At the park, all the other children came to look. 'Wow! Look at her style!' they said. Rafiki smiled and danced in the sun.",
                imageUrl: "https://image.pollinations.ai/prompt/kids%20playing%20in%20park,%20admiring%20girl%20with%20sunglasses,%20sunny?width=800&height=600&nologo=true"
            }
        ]
    },
    {
        id: "bd-2",
        title: "Sing to Me",
        author: "Nicole Levin",
        coverImage: "https://image.pollinations.ai/prompt/cute%20boy%20singing%20happily,%20music%20notes,%20children%20book%20cover?width=400&height=600&nologo=true",
        pages: [
            {
                chapterTitle: "Sing to Me",
                text: "Vusi loves to sing. He sings when he wakes up. He sings when he brushes his teeth. He makes happy noises all day long!",
                imageUrl: "https://image.pollinations.ai/prompt/cute%20boy%20singing%20in%20bathroom%20brushing%20teeth?width=800&height=600&nologo=true"
            },
            {
                chapterTitle: "The Radio",
                text: "Sometimes, the radio sings with him. Vusi dances and spins around the kitchen floor. Music is magic!",
                imageUrl: "https://image.pollinations.ai/prompt/boy%20dancing%20in%20kitchen%20to%20radio,%20cartoon?width=800&height=600&nologo=true"
            },
            {
                chapterTitle: "Bedtime Song",
                text: "At night, his mother sings him a soft song. 'Sleep well, my little songbird,' she says, tucking him in warm and tight.",
                imageUrl: "https://image.pollinations.ai/prompt/mother%20tucking%20child%20in%20bed,%20peaceful,%20night%20time?width=800&height=600&nologo=true"
            }
        ]
    },
    {
        id: "bd-3",
        title: "The Girl Who Saved the Stars",
        author: "Buhle Ngaba",
        coverImage: "https://image.pollinations.ai/prompt/magical%20girl%20catching%20stars%20in%20sky,%20dark%20blue%20background,%20glowing?width=400&height=600&nologo=true",
        pages: [
            {
                chapterTitle: "No More Stars",
                text: "One night, the stars disappeared. The sky was dark and empty. Where did the sparkles go?",
                imageUrl: "https://image.pollinations.ai/prompt/dark%20night%20sky%20no%20stars,%20sad%20cartoon%20style?width=800&height=600&nologo=true"
            },
            {
                chapterTitle: "The Search",
                text: "A little girl named Kaelo decided to find them. She packed her bag with a torch and a sandwich. 'I will save them!' she whispered.",
                imageUrl: "https://image.pollinations.ai/prompt/brave%20girl%20hiking%20with%20flashlight,%20adventure?width=800&height=600&nologo=true"
            },
            {
                chapterTitle: "The Discovery",
                text: "She climbed the highest mountain and found the stars hiding in a cave. 'We were cold!' they twinkled. She gave them warm hugs.",
                imageUrl: "https://image.pollinations.ai/prompt/glowing%20stars%20hiding%20in%20a%20cave,%20magical?width=800&height=600&nologo=true"
            }
        ]
    }
];
