-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL, -- 'bank', 'insurance', 'tax', 'housing', 'transportation', 'subscriptions', 'professionals'
  account_name TEXT NOT NULL,
  account_details JSONB DEFAULT '{}',
  payment_frequency TEXT, -- 'monthly', 'quarterly', 'annually', 'one-time'
  two_factor_method TEXT, -- 'app', 'sms', 'email', 'voice', 'token', 'other'
  associated_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wellness_checks table
CREATE TABLE IF NOT EXISTS public.wellness_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- 'quick_check', 'full_check'
  response_data JSONB DEFAULT '{}',
  response_time INTEGER, -- in milliseconds
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wellness_check_frequency INTEGER DEFAULT 30, -- days
  two_factor_methods JSONB DEFAULT '[]',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for accounts
CREATE POLICY "accounts_select_own" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "accounts_insert_own" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "accounts_update_own" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "accounts_delete_own" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for wellness_checks
CREATE POLICY "wellness_checks_select_own" ON public.wellness_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wellness_checks_insert_own" ON public.wellness_checks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wellness_checks_update_own" ON public.wellness_checks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wellness_checks_delete_own" ON public.wellness_checks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "user_settings_select_own" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_settings_insert_own" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_settings_update_own" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_settings_delete_own" ON public.user_settings FOR DELETE USING (auth.uid() = user_id);
