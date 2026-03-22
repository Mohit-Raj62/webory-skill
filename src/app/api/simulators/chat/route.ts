import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history, hints = [], currentHintIndex = 0, scenario } = body;

        if (!process.env.GEMINI_API_KEY) {
            // Fallback mock
            return NextResponse.json({ success: true, reply: "I'm your virtual manager. (AI Key Missing - check terminal)" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const historyText = history.map((msg: any) => `${msg.sender === 'user' ? 'Junior Dev' : 'Manager'}: ${msg.text}`).join('\n');
        
        // Define hints to give if requested
        let hintContext = "The user has not explicitly asked for a hint.";
        const wantsHint = message.toLowerCase().includes("hint") || message.toLowerCase().includes("stuck") || message.toLowerCase().includes("help");
        
        if (wantsHint) {
            if (hints.length > 0) {
                const idx = currentHintIndex < hints.length ? currentHintIndex : hints.length - 1;
                hintContext = `THE USER IS ASKING FOR HELP OR A HINT. You MUST provide this hint to them naturally: "${hints[idx]}"`;
            } else {
                hintContext = `THE USER IS ASKING FOR HELP OR A HINT. You don't have any predefined hints, so give them a subtle clue about the task: ${scenario?.tasks?.[0]?.desc || 'Fix the code'}`;
            }
        }

        const prompt = `
            Act as a supportive but realistic Engineering Manager monitoring a Junior Developer taking a coding test/scenario.
            Role: ${scenario?.role || 'Developer'}
            Task: ${scenario?.tasks?.[0]?.desc || 'Complete the feature.'}
            
            ${hintContext}
            
            Previous Conversation:
            ${historyText}
            
            Respond as the Manager to the Junior Dev's last message. Keep it to 1-2 brief sentences max. Be helpful but don't just write the code for them.
        `;

        const result = await model.generateContent(prompt);
        let reply = result.response.text().trim();

        return NextResponse.json({ success: true, reply, hintUsed: wantsHint });
    } catch (error: any) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
