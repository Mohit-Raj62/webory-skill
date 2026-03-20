const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The listModels method is on the genAI object itself or via a specific call
        // In some versions it's different. Let's try the direct fetch way if SDK method is missing
        console.log("Checking models for key:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
        
        // Using fetch to be SDK-version independent
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("ListModels Failed:", error.message);
    }
}

listModels();
