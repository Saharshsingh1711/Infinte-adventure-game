require('dotenv').config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const history = [
    {
      role: "system",
      content: "You are a creative Text Adventure Game Master. I will describe a setting or scenario. You will adapt to that setting and act as the narrator/GM. Start by acknowledging the setting and describing the immediate surroundings."
    },
    { role: "user", content: "hello" }
];

async function test() {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: history,
            }),
        });
        
        if (!response.ok) {
            console.log("Error status:", response.status);
            console.log("Error body:", await response.text());
        } else {
            console.log("Success!", await response.json());
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}
test();
