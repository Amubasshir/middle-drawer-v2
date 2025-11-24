-- Add contact preferences and emergency contact settings
CREATE TABLE IF NOT EXISTS contact_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER DEFAULT 1, -- For single user setup
  reminder_frequency VARCHAR(20) DEFAULT 'weekly', -- daily, weekly, monthly
  reminder_method VARCHAR(20) DEFAULT 'email', -- email, text, both
  user_email VARCHAR(255),
  user_phone VARCHAR(20),
  emergency_contact_name VARCHAR(255),
  emergency_contact_email VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  days_before_emergency_contact INTEGER DEFAULT 3, -- How many days of no response before contacting emergency contact
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default preferences
INSERT INTO contact_preferences (
  reminder_frequency, 
  reminder_method, 
  days_before_emergency_contact
) VALUES (
  'weekly', 
  'email', 
  3
) ON CONFLICT DO NOTHING;
