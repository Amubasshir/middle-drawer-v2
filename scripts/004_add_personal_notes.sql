-- Add personal notes table for non-financial tasks and important information
CREATE TABLE IF NOT EXISTS personal_notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    is_task BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT false,
    is_emergency_info BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some example categories
INSERT INTO personal_notes (title, content, category, priority, is_task, is_emergency_info) VALUES
('House Key Location', 'Spare key is hidden under the blue flower pot by the front door', 'home', 'high', false, true),
('WiFi Password', 'Network: HomeWiFi, Password: SecurePass123!', 'home', 'medium', false, true),
('Weekly Trash Day', 'Trash pickup is every Tuesday morning - put bins out Monday night', 'home', 'medium', true, false),
('Emergency Contacts', 'Mom: (555) 123-4567, Best Friend Sarah: (555) 987-6543', 'emergency', 'high', false, true);
