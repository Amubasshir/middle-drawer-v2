-- ============================================================================
-- Complete Database Schema for Middle Drawer / WhichPoint
-- Financial Responsibilities Tracker with Brain Health Monitoring
-- ============================================================================
-- This schema includes all tables needed for:
-- - Authentication & User Profiles
-- - Financial Accounts (Banking, Credit, Investment, Insurance)
-- - Bills & Recurring Expenses
-- - Payment Schedules
-- - Delegates & Trusted Contacts
-- - Personal Notes & Tasks
-- - Wellness Checks (Cognitive Health)
-- - Insurance Policies
-- - Tax Accounts
-- - Social Media Accounts
-- - Contact Preferences & Emergency Contacts
-- - Categories & Priority Management
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- AUTHENTICATION & USER PROFILES
-- ============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  is_guest BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FINANCIAL ACCOUNTS
-- ============================================================================

-- Account types lookup table
CREATE TABLE IF NOT EXISTS public.account_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'banking', 'credit', 'investment', 'insurance', 'utilities', 'subscription'
  icon VARCHAR(50), -- icon identifier for UI
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL, -- 'checking', 'savings', 'credit', 'mortgage', 'auto-loan', 'health-insurance', etc.
  account_name TEXT NOT NULL,
  institution_name TEXT,
  account_number TEXT, -- last 4 digits or masked
  username TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  current_balance DECIMAL(12,2),
  credit_limit DECIMAL(12,2), -- for credit accounts
  interest_rate DECIMAL(5,4), -- annual percentage rate
  payment_frequency TEXT, -- 'monthly', 'quarterly', 'annually', 'one-time', 'weekly', 'bi-weekly'
  two_factor_method TEXT, -- 'app', 'sms', 'email', 'voice', 'token', 'other'
  associated_email TEXT,
  priority_level INTEGER DEFAULT 3, -- 1=critical, 2=important, 3=normal, 4=low
  is_active BOOLEAN DEFAULT TRUE,
  account_details JSONB DEFAULT '{}', -- flexible storage for additional fields
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BILLS & RECURRING EXPENSES
-- ============================================================================

-- Bills table
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  bill_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'mortgage', 'utilities', 'insurance', 'credit_card', 'loan', 'phone', 'subscription', 'other'
  amount DECIMAL(10,2) NOT NULL,
  is_estimate BOOLEAN DEFAULT FALSE,
  frequency TEXT NOT NULL, -- 'monthly', 'weekly', 'quarterly', 'yearly', 'bi-weekly'
  due_day INTEGER, -- day of month (1-31) for monthly bills
  due_date DATE, -- specific due date for non-monthly bills
  auto_pay BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  priority_level INTEGER DEFAULT 3, -- 1=critical, 2=important, 3=normal, 4=low
  reminder_days INTEGER DEFAULT 3, -- days before due date to remind
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'paid', 'overdue', 'cancelled'
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill payment history
CREATE TABLE IF NOT EXISTS public.bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  confirmation_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENT SCHEDULES
-- ============================================================================

-- Payment schedules table (detailed payment timing)
CREATE TABLE IF NOT EXISTS public.payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  payment_name TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly', 'one-time'
  due_type TEXT NOT NULL, -- 'monthly_day', 'exact_date', 'approximate'
  due_day INTEGER, -- day of month (1-31) when due_type is 'monthly_day'
  due_date DATE, -- specific date when due_type is 'exact_date'
  approximate_timing TEXT, -- 'beginning', 'mid-month', 'end', 'custom' when due_type is 'approximate'
  auto_pay BOOLEAN DEFAULT FALSE,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- DELEGATES & TRUSTED CONTACTS
-- ============================================================================

-- Delegates table (authorized users who can access accounts)
CREATE TABLE IF NOT EXISTS public.delegates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT, -- 'spouse', 'family', 'friend', 'neighbor', 'colleague', 'other'
  permissions TEXT[], -- array of permissions: 'Full Access', 'Financial', 'Medical', 'Emergency Only'
  notes TEXT,
  notification_message TEXT, -- message sent when delegate is added/updated
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delegate contact information (emails and phones)
CREATE TABLE IF NOT EXISTS public.delegate_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegate_id UUID NOT NULL REFERENCES public.delegates(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL, -- 'email' or 'phone'
  contact_value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PERSONAL NOTES & TASKS
-- ============================================================================

-- Personal notes table
CREATE TABLE IF NOT EXISTS public.personal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general', -- 'general', 'home', 'emergency', 'health', 'work'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  is_task BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  is_emergency_info BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- WELLNESS CHECKS (Cognitive Health)
-- ============================================================================

-- Wellness checks table
CREATE TABLE IF NOT EXISTS public.wellness_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- 'quick_check', 'full_check'
  question TEXT,
  answer TEXT,
  score INTEGER,
  response_data JSONB DEFAULT '{}',
  response_time INTEGER, -- in milliseconds
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INSURANCE POLICIES
-- ============================================================================

-- Insurance policies table
CREATE TABLE IF NOT EXISTS public.insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL, -- 'health', 'auto', 'home', 'life', 'disability', 'renters', 'umbrella'
  company_name TEXT NOT NULL,
  policy_number TEXT,
  agent_name TEXT,
  agent_email TEXT,
  agent_phone TEXT,
  customer_service_phone TEXT,
  website_url TEXT,
  login_username TEXT,
  premium_amount DECIMAL(10,2),
  payment_frequency TEXT, -- 'monthly', 'quarterly', 'semi-annually', 'annually'
  due_date_type TEXT, -- 'exact_date', 'monthly_day', 'approximate'
  due_date DATE,
  due_day_of_month INTEGER,
  due_description TEXT, -- e.g., "1st of each month", "January 15th and July 15th"
  policy_start_date DATE,
  policy_end_date DATE,
  deductible DECIMAL(10,2),
  coverage_details TEXT,
  notes TEXT,
  priority INTEGER DEFAULT 2, -- 1=critical, 2=important, 3=normal, 4=low
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'expired', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TAX ACCOUNTS
-- ============================================================================

-- Tax accounts table
CREATE TABLE IF NOT EXISTS public.tax_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL, -- 'irs', 'state_tax', 'cpa', 'tax_software', 'payroll'
  entity_name TEXT NOT NULL, -- 'IRS', 'California FTB', 'H&R Block', etc.
  account_number TEXT, -- SSN, EIN, Client ID, etc.
  contact_person TEXT, -- CPA name, tax preparer, etc.
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  login_username TEXT,
  tax_year INTEGER,
  filing_status TEXT,
  important_dates TEXT, -- filing deadlines, estimated payment dates, appointment schedules
  document_location TEXT, -- where tax documents are stored
  notes TEXT,
  priority INTEGER DEFAULT 1, -- taxes are typically high priority
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SOCIAL MEDIA ACCOUNTS
-- ============================================================================

-- Social media accounts table
CREATE TABLE IF NOT EXISTS public.social_media_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'TikTok', 'Snapchat', 'WhatsApp'
  username TEXT,
  email TEXT,
  phone TEXT,
  account_url TEXT,
  recovery_email TEXT,
  recovery_phone TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  backup_codes TEXT,
  notes TEXT,
  priority INTEGER DEFAULT 3, -- 1=critical, 2=important, 3=normal, 4=low
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended', 'deleted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONTACT PREFERENCES & EMERGENCY CONTACTS
-- ============================================================================

-- Contact preferences table
CREATE TABLE IF NOT EXISTS public.contact_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_frequency TEXT DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  reminder_method TEXT DEFAULT 'email', -- 'email', 'text', 'both'
  user_email TEXT,
  user_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  relationship TEXT, -- 'spouse', 'family', 'friend', 'neighbor', 'colleague', 'other'
  days_to_contact INTEGER DEFAULT 3, -- days of no response before contacting this emergency contact
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER SETTINGS
-- ============================================================================

-- User settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wellness_check_frequency INTEGER DEFAULT 30, -- days between wellness checks
  two_factor_methods JSONB DEFAULT '[]',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "wellness_reminders": true,
    "bill_reminders": true,
    "security_alerts": true
  }',
  privacy_settings JSONB DEFAULT '{
    "profile_visibility": "private",
    "data_sharing": false,
    "analytics": true
  }',
  accessibility JSONB DEFAULT '{
    "font_size": "medium",
    "high_contrast": false,
    "screen_reader": false
  }',
  theme TEXT DEFAULT 'light', -- 'light', 'dark', 'auto'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- EMAIL SYNC & PARSING
-- ============================================================================

-- Email sync log table
CREATE TABLE IF NOT EXISTS public.email_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  emails_processed INTEGER DEFAULT 0,
  accounts_found INTEGER DEFAULT 0,
  accounts_updated INTEGER DEFAULT 0,
  sync_status TEXT DEFAULT 'completed', -- 'running', 'completed', 'failed'
  error_message TEXT,
  sync_details JSONB DEFAULT '{}' -- store details about what was found/updated
);

-- ============================================================================
-- CATEGORIES (for organization)
-- ============================================================================

-- Financial categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for system categories
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- system categories vs user-created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login);

-- Accounts indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON public.accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_priority ON public.accounts(priority_level);

-- Bills indexes
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON public.bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_category ON public.bills(category);

-- Payment schedules indexes
CREATE INDEX IF NOT EXISTS idx_payment_schedules_user_id ON public.payment_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_account_id ON public.payment_schedules(account_id);

-- Delegates indexes
CREATE INDEX IF NOT EXISTS idx_delegates_user_id ON public.delegates(user_id);

-- Personal notes indexes
CREATE INDEX IF NOT EXISTS idx_personal_notes_user_id ON public.personal_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_notes_category ON public.personal_notes(category);
CREATE INDEX IF NOT EXISTS idx_personal_notes_is_task ON public.personal_notes(is_task);
CREATE INDEX IF NOT EXISTS idx_personal_notes_is_emergency ON public.personal_notes(is_emergency_info);

-- Wellness checks indexes
CREATE INDEX IF NOT EXISTS idx_wellness_checks_user_id ON public.wellness_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_checks_created_at ON public.wellness_checks(created_at);

-- Insurance policies indexes
CREATE INDEX IF NOT EXISTS idx_insurance_policies_user_id ON public.insurance_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_policies_policy_type ON public.insurance_policies(policy_type);

-- Tax accounts indexes
CREATE INDEX IF NOT EXISTS idx_tax_accounts_user_id ON public.tax_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_accounts_tax_year ON public.tax_accounts(tax_year);

-- Social media accounts indexes
CREATE INDEX IF NOT EXISTS idx_social_media_user_id ON public.social_media_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_media_platform ON public.social_media_accounts(platform);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegate_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Accounts policies
CREATE POLICY "accounts_select_own" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "accounts_insert_own" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "accounts_update_own" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "accounts_delete_own" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- Bills policies
CREATE POLICY "bills_select_own" ON public.bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bills_insert_own" ON public.bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bills_update_own" ON public.bills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bills_delete_own" ON public.bills FOR DELETE USING (auth.uid() = user_id);

-- Bill payments policies (through bill relationship)
CREATE POLICY "bill_payments_select_own" ON public.bill_payments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.bills WHERE bills.id = bill_payments.bill_id AND bills.user_id = auth.uid()));
CREATE POLICY "bill_payments_insert_own" ON public.bill_payments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.bills WHERE bills.id = bill_payments.bill_id AND bills.user_id = auth.uid()));
CREATE POLICY "bill_payments_update_own" ON public.bill_payments FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.bills WHERE bills.id = bill_payments.bill_id AND bills.user_id = auth.uid()));
CREATE POLICY "bill_payments_delete_own" ON public.bill_payments FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.bills WHERE bills.id = bill_payments.bill_id AND bills.user_id = auth.uid()));

-- Payment schedules policies
CREATE POLICY "payment_schedules_select_own" ON public.payment_schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payment_schedules_insert_own" ON public.payment_schedules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payment_schedules_update_own" ON public.payment_schedules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "payment_schedules_delete_own" ON public.payment_schedules FOR DELETE USING (auth.uid() = user_id);

-- Delegates policies
CREATE POLICY "delegates_select_own" ON public.delegates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "delegates_insert_own" ON public.delegates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delegates_update_own" ON public.delegates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delegates_delete_own" ON public.delegates FOR DELETE USING (auth.uid() = user_id);

-- Delegate contacts policies (through delegate relationship)
CREATE POLICY "delegate_contacts_select_own" ON public.delegate_contacts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.delegates WHERE delegates.id = delegate_contacts.delegate_id AND delegates.user_id = auth.uid()));
CREATE POLICY "delegate_contacts_insert_own" ON public.delegate_contacts FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.delegates WHERE delegates.id = delegate_contacts.delegate_id AND delegates.user_id = auth.uid()));
CREATE POLICY "delegate_contacts_update_own" ON public.delegate_contacts FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.delegates WHERE delegates.id = delegate_contacts.delegate_id AND delegates.user_id = auth.uid()));
CREATE POLICY "delegate_contacts_delete_own" ON public.delegate_contacts FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.delegates WHERE delegates.id = delegate_contacts.delegate_id AND delegates.user_id = auth.uid()));

-- Personal notes policies
CREATE POLICY "personal_notes_select_own" ON public.personal_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "personal_notes_insert_own" ON public.personal_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "personal_notes_update_own" ON public.personal_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "personal_notes_delete_own" ON public.personal_notes FOR DELETE USING (auth.uid() = user_id);

-- Wellness checks policies
CREATE POLICY "wellness_checks_select_own" ON public.wellness_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wellness_checks_insert_own" ON public.wellness_checks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wellness_checks_update_own" ON public.wellness_checks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wellness_checks_delete_own" ON public.wellness_checks FOR DELETE USING (auth.uid() = user_id);

-- Insurance policies policies
CREATE POLICY "insurance_policies_select_own" ON public.insurance_policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insurance_policies_insert_own" ON public.insurance_policies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "insurance_policies_update_own" ON public.insurance_policies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "insurance_policies_delete_own" ON public.insurance_policies FOR DELETE USING (auth.uid() = user_id);

-- Tax accounts policies
CREATE POLICY "tax_accounts_select_own" ON public.tax_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tax_accounts_insert_own" ON public.tax_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tax_accounts_update_own" ON public.tax_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tax_accounts_delete_own" ON public.tax_accounts FOR DELETE USING (auth.uid() = user_id);

-- Social media accounts policies
CREATE POLICY "social_media_accounts_select_own" ON public.social_media_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "social_media_accounts_insert_own" ON public.social_media_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "social_media_accounts_update_own" ON public.social_media_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "social_media_accounts_delete_own" ON public.social_media_accounts FOR DELETE USING (auth.uid() = user_id);

-- Contact preferences policies
CREATE POLICY "contact_preferences_select_own" ON public.contact_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contact_preferences_insert_own" ON public.contact_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contact_preferences_update_own" ON public.contact_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contact_preferences_delete_own" ON public.contact_preferences FOR DELETE USING (auth.uid() = user_id);

-- Emergency contacts policies
CREATE POLICY "emergency_contacts_select_own" ON public.emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "emergency_contacts_insert_own" ON public.emergency_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "emergency_contacts_update_own" ON public.emergency_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "emergency_contacts_delete_own" ON public.emergency_contacts FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "user_settings_select_own" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_settings_insert_own" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_settings_update_own" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_settings_delete_own" ON public.user_settings FOR DELETE USING (auth.uid() = user_id);

-- Email sync log policies
CREATE POLICY "email_sync_log_select_own" ON public.email_sync_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "email_sync_log_insert_own" ON public.email_sync_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories policies (system categories are readable by all, user categories are private)
CREATE POLICY "categories_select_system" ON public.categories FOR SELECT USING (is_system = TRUE);
CREATE POLICY "categories_select_own" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "categories_insert_own" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id OR is_system = TRUE);
CREATE POLICY "categories_update_own" ON public.categories FOR UPDATE USING (auth.uid() = user_id AND is_system = FALSE);
CREATE POLICY "categories_delete_own" ON public.categories FOR DELETE USING (auth.uid() = user_id AND is_system = FALSE);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.contact_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile and settings when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_schedules_updated_at BEFORE UPDATE ON public.payment_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delegates_updated_at BEFORE UPDATE ON public.delegates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_notes_updated_at BEFORE UPDATE ON public.personal_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON public.insurance_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_accounts_updated_at BEFORE UPDATE ON public.tax_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_media_accounts_updated_at BEFORE UPDATE ON public.social_media_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_preferences_updated_at BEFORE UPDATE ON public.contact_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- INSERT DEFAULT DATA (Optional)
-- ============================================================================

-- Insert default account types (if needed)
-- These can also be managed in the application code

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

