import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetches the custom system prompt for a unique clerk user id.
 * @param {string} clerkId 
 * @returns {Promise<string|null>} The system prompt string or null if none
 */
export async function getSystemPrompt(clerkId) {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('system_prompt')
      .eq('clerk_id', clerkId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching system prompt:', error);
      return null;
    }
    return data?.system_prompt || null;
  } catch (error) {
    console.error('Unexpected error fetching system prompt:', error);
    return null;
  }
}
