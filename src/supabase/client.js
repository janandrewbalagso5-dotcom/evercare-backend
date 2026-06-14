import { createClient } from "@supabase/supabase-js";

const isConfigured = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY;

export const isMock = !isConfigured;

export const supabase = isConfigured
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    : null;

if (isConfigured) {
    console.log("EverCare Backend: Supabase client initialized.");
} else {
    console.log("EverCare Backend: No Supabase config. Running in mock mode.");
}
