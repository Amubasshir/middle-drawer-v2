-- Creating wellness_checks table for cognitive wellness tracking
CREATE TABLE IF NOT EXISTS public.wellness_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_wellness_checks_user_id ON public.wellness_checks(user_id);

-- Create an index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_wellness_checks_created_at ON public.wellness_checks(created_at);

-- Enable Row Level Security
ALTER TABLE public.wellness_checks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own wellness checks
CREATE POLICY "Users can only access their own wellness checks" ON public.wellness_checks
    FOR ALL USING (user_id = current_setting('app.current_user_id', true));

-- Create policy to allow authenticated users to insert their own wellness checks
CREATE POLICY "Users can insert their own wellness checks" ON public.wellness_checks
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));
