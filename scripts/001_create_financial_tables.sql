-- Creating database schema for financial responsibility tracker

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account types (checking, savings, credit card, etc.)
CREATE TABLE IF NOT EXISTS account_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'banking', 'credit', 'investment', 'insurance'
  icon VARCHAR(50), -- icon identifier for UI
  is_critical BOOLEAN DEFAULT false, -- critical for daily functioning
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User financial accounts
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_type_id UUID REFERENCES account_types(id),
  account_name VARCHAR(255) NOT NULL,
  institution_name VARCHAR(255),
  account_number VARCHAR(100), -- encrypted/masked
  username VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  current_balance DECIMAL(12,2),
  credit_limit DECIMAL(12,2), -- for credit accounts
  interest_rate DECIMAL(5,4), -- annual percentage rate
  is_active BOOLEAN DEFAULT true,
  priority_level INTEGER DEFAULT 3, -- 1=critical, 2=important, 3=normal, 4=low
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring expenses and bills
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  expense_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'mortgage', 'rent', 'utilities', 'insurance', 'credit_card', 'loan'
  amount DECIMAL(10,2) NOT NULL,
  is_estimate BOOLEAN DEFAULT false,
  frequency VARCHAR(20) NOT NULL, -- 'monthly', 'weekly', 'yearly', 'quarterly'
  due_day INTEGER, -- day of month for monthly bills
  due_date DATE, -- specific due date
  auto_pay BOOLEAN DEFAULT false,
  priority_level INTEGER DEFAULT 3,
  reminder_days INTEGER DEFAULT 3, -- days before due date to remind
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill payment history
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_expense_id UUID REFERENCES recurring_expenses(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(100),
  confirmation_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default account types
INSERT INTO account_types (name, category, icon, is_critical) VALUES
('Checking Account', 'banking', 'CreditCard', true),
('Savings Account', 'banking', 'PiggyBank', false),
('Credit Card', 'credit', 'CreditCard', true),
('Mortgage', 'credit', 'Home', true),
('Auto Loan', 'credit', 'Car', true),
('Personal Loan', 'credit', 'DollarSign', false),
('Health Insurance', 'insurance', 'Heart', true),
('Auto Insurance', 'insurance', 'Car', true),
('Life Insurance', 'insurance', 'Shield', false),
('Investment Account', 'investment', 'TrendingUp', false),
('Retirement Account', 'investment', 'PiggyBank', false),
('Utility Account', 'utilities', 'Zap', true),
('Phone/Internet', 'utilities', 'Phone', true),
('Streaming Service', 'subscription', 'Play', false),
('Gym Membership', 'subscription', 'Activity', false)
ON CONFLICT DO NOTHING;
