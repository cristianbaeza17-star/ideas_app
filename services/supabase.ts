
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

// IMPORTANT: In a real-world application, these values should be stored in
// environment variables (.env file) and not hardcoded.
// For Vercel, you would set these in the project's environment variable settings.
const supabaseUrl = 'https://fjddlslynjxoesahiiux.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGRsc2x5bmp4b2VzYWhpaXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTY1MzksImV4cCI6MjA3ODA3MjUzOX0.4QPdcHByRjXmgjqRNqqu0VHPHMDvJQ0HNTbyxYKzdhY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/* 
  SQL SCHEMA FOR THE 'ideas' TABLE IN SUPABASE:
  
  You need to run this SQL in your Supabase project's SQL Editor to create the
  'ideas' table and set up the necessary policies for it to work.

  -- 1. Create the table
  CREATE TABLE ideas (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
  );

  -- 2. Enable Row Level Security (RLS) on the table
  ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

  -- 3. Create a policy that allows users to insert their own ideas
  CREATE POLICY "Users can insert their own ideas"
  ON ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

  -- 4. Create a policy that allows users to view only their own ideas
  CREATE POLICY "Users can view their own ideas"
  ON ideas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

  -- 5. (Optional) Create a policy that allows users to delete their own ideas
  CREATE POLICY "Users can delete their own ideas"
  ON ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
*/
