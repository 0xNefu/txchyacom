
import type { APIRoute } from 'astro';
import OpenAI from 'openai';

// Import prompts using Vite's raw import feature for compatibility with Cloudflare Workers
import systemPrompt from '../../prompts/txchya-system-prompt.txt?raw';
import restrictions from '../../prompts/txchya-restrictions.txt?raw';
import everrankPrompt from '../../prompts/txchya-everrank-prompt.txt?raw';
import everrankRestrictions from '../../prompts/txchya-everrank-restrictions.txt?raw';

// --- Shared CORS Logic ---
const ALLOWED_ORIGINS = [
    'https://txchya.com',
    'https://txchyon.com',
    'https://everrank.app',
    'https://renterrate.com', // Added RenterRate
    'http://localhost:4321', // Local dev
    'http://localhost:3000'
];

function getCorsOrigin(request: Request): string {
    const origin = request.headers.get('origin');
    if (!origin) return ALLOWED_ORIGINS[0];

    // Check if origin starts with any of the allowed origins (to allow subdomains if needed, or exact match)
    const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    return isAllowed ? origin : ALLOWED_ORIGINS[0];
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { message, site = 'Txchya.com' } = body;

        // Initialize OpenAI client
        const apiKey = import.meta.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error('OPENAI_API_KEY not found');
            return new Response(JSON.stringify({ error: 'System Configuration Error: API Key missing.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const openai = new OpenAI({ apiKey });

        // --- Context Logic ---
        let finalSystemPrompt = systemPrompt; // Default fallback
        let activeRestrictions = restrictions;
        let brandRestrictions = "";
        let currentBrand = "Txchyon";

        // Determine Brand Context
        const lowerSite = site.toLowerCase();

        if (lowerSite.includes('everrank')) {
            currentBrand = "EverRank";
            finalSystemPrompt = everrankPrompt;
            brandRestrictions = everrankRestrictions;
        } else if (lowerSite.includes('next-scanner') || lowerSite.includes('nextscanner')) {
            currentBrand = "Next Scanner";
        } else if (lowerSite.includes('renterrate')) {
            currentBrand = "RenterRate";
            // Uses default prompts for now, but context is set
        }

        // Construct the enhanced prompt
        const enhancedSystemPrompt = `${finalSystemPrompt}\n\n${activeRestrictions}\n\n${brandRestrictions}\n\n[CORE_LOGIC: You are currently active on ${currentBrand}. Hostname: ${site}. Always identify as the assistant for ${currentBrand} in this conversation.]`;

        // Log for debugging
        console.log(`🧠 Txchya Processing Request for: ${currentBrand} (${site})`);

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: enhancedSystemPrompt },
                { role: "user", content: message }
            ],
            model: "gpt-4o-mini", // Fallback to 3.5-turbo if 4o-mini not available
            max_tokens: 500,
        });

        const reply = completion.choices[0].message.content;
        const corsOrigin = getCorsOrigin(request);

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': corsOrigin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });

    } catch (error: any) {
        console.error('Txchya Brain Error:', error);
        return new Response(JSON.stringify({ error: 'Neural Link Failed: ' + (error.message || 'Unknown Error') }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = ({ request }) => {
    const corsOrigin = getCorsOrigin(request);

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};
