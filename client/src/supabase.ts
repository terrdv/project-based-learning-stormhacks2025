import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars on import.meta.env and requires the VITE_ prefix for client-side usage.
// Do NOT use `process.env` or `dotenv` in client code — those are server/Node-only.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
	console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_KEY is not set. Add them to client/.env and restart the dev server.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);



