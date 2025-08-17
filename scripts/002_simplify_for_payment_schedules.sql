-- Simplified schema focusing on account credentials and payment schedules

-- Drop existing tables to start fresh with simpler approach
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS recurring_expenses CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS account_types CASCADE;

-- Simplified account types
CREATE TABLE IF NOT EXISTS account_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simplified accounts table focusing on credentials and basic info
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(100) NOT NULL,
  institution_name VARCHAR(255),
  username VARCHAR(255), -- Primary focus: login credentials
  email VARCHAR(255),
  phone VARCHAR(50),
  website_url VARCHAR(500),
  account_number_last4 VARCHAR(4), -- Just last 4 digits for reference
  is_critical BOOLEAN DEFAULT false, -- Critical for daily functioning
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment schedules - when things need to be paid
CREATE TABLE IF NOT EXISTS payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  payment_name VARCHAR(255) NOT NULL, -- "Credit Card Payment", "Mortgage", etc.
  due_type VARCHAR(20) NOT NULL, -- 'exact_date', 'monthly_day', 'approximate'
  due_day INTEGER, -- Day of month (1-31) for monthly payments
  due_date DATE, -- Specific date for one-time or annual payments
  approximate_timing VARCHAR(100), -- "Around the 15th", "End of month", "Beginning of month"
  frequency VARCHAR(20) NOT NULL, -- 'monthly', 'weekly', 'yearly', 'quarterly', 'one-time'
  auto_pay BOOLEAN DEFAULT false,
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert simplified account types
INSERT INTO account_types (name, category, icon, is_critical) VALUES
('Bank Account', 'banking', 'CreditCard', true),
('Credit Card', 'credit', 'CreditCard', true),
('Mortgage/Rent', 'housing', 'Home', true),
('Auto Loan', 'loans', 'Car', true),
('Insurance', 'insurance', 'Shield', true),
('Utilities', 'utilities', 'Zap', true),
('Phone/Internet', 'utilities', 'Phone', true),
('Streaming Service', 'subscriptions', 'Play', false),
('Gym/Fitness', 'subscriptions', 'Activity', false),
('Investment Account', 'investments', 'TrendingUp', false),
('Government/Tax', 'government', 'FileText', true),
('Medical/Healthcare', 'healthcare', 'Heart', false)
ON CONFLICT DO NOTHING;
