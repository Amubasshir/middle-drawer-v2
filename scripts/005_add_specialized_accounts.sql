-- Add specialized account tables for social media, insurance, and taxes

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(100) NOT NULL, -- Facebook, Instagram, Twitter, LinkedIn, etc.
    username VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(50),
    account_url VARCHAR(500),
    recovery_email VARCHAR(255),
    recovery_phone VARCHAR(50),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT,
    notes TEXT,
    priority INTEGER DEFAULT 3, -- 1=critical, 2=important, 3=normal, 4=low
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Policies
CREATE TABLE IF NOT EXISTS insurance_policies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    policy_type VARCHAR(100) NOT NULL, -- health, auto, home, life, disability, etc.
    company_name VARCHAR(255) NOT NULL,
    policy_number VARCHAR(255),
    agent_name VARCHAR(255),
    agent_email VARCHAR(255),
    agent_phone VARCHAR(50),
    customer_service_phone VARCHAR(50),
    website_url VARCHAR(500),
    login_username VARCHAR(255),
    premium_amount DECIMAL(10,2),
    payment_frequency VARCHAR(50), -- monthly, quarterly, annually
    due_date_type VARCHAR(50), -- exact_date, monthly_day, approximate
    due_date DATE,
    due_day_of_month INTEGER,
    due_description VARCHAR(255),
    policy_start_date DATE,
    policy_end_date DATE,
    deductible DECIMAL(10,2),
    coverage_details TEXT,
    notes TEXT,
    priority INTEGER DEFAULT 2,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax Information
CREATE TABLE IF NOT EXISTS tax_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_type VARCHAR(100) NOT NULL, -- irs, state_tax, cpa, tax_software, etc.
    entity_name VARCHAR(255) NOT NULL, -- IRS, California FTB, H&R Block, etc.
    account_number VARCHAR(255),
    contact_person VARCHAR(255), -- CPA name, tax preparer, etc.
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website_url VARCHAR(500),
    login_username VARCHAR(255),
    tax_year INTEGER,
    filing_status VARCHAR(50),
    important_dates TEXT, -- filing deadlines, estimated payment dates
    document_location TEXT, -- where tax documents are stored
    notes TEXT,
    priority INTEGER DEFAULT 1, -- taxes are typically high priority
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Sync Log
CREATE TABLE IF NOT EXISTS email_sync_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sync_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    emails_processed INTEGER DEFAULT 0,
    accounts_found INTEGER DEFAULT 0,
    accounts_updated INTEGER DEFAULT 0,
    sync_status VARCHAR(50) DEFAULT 'completed', -- running, completed, failed
    error_message TEXT,
    sync_details JSONB -- store details about what was found/updated
);
