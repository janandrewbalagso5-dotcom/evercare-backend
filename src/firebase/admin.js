import { createClient } from "@supabase/supabase-js";

const isConfigured =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_ANON_KEY;

let db = null;
let isMock = true;

if (isConfigured) {
  try {
    db = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    isMock = false;
    console.log("EverCare Backend: Supabase client initialized successfully.");
  } catch (error) {
    console.error("EverCare Backend: Supabase init failed, using mock data.", error.message);
    isMock = true;
  }
} else {
  console.log("EverCare Backend: No Supabase config found. Running in mock mode.");
}

export { db, isMock };