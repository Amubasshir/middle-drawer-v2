/* Auto-generated minimal DB types for main tables used in the app.
   Keep interfaces minimal and extend as needed. */

export interface Profile {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  timezone?: string | null;
  language?: string | null;
  is_guest?: boolean;
  last_login?: string | null;
  login_count?: number;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Account {
  id: string;
  user_id: string;
  account_type: string;
  account_name: string;
  institution_name?: string | null;
  account_number?: string | null;
  current_balance?: number | null;
  priority_level?: number | null;
  account_details?: Record<string, any> | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Bill {
  id: string;
  user_id: string;
  account_id?: string | null;
  bill_name: string;
  category: string;
  amount: number;
  frequency: string;
  due_day?: number | null;
  due_date?: string | null;
  auto_pay?: boolean;
  status?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PersonalNote {
  id: string;
  user_id: string;
  title: string;
  content?: string | null;
  category?: string | null;
  priority?: string | null;
  is_task?: boolean;
  is_completed?: boolean;
  due_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface WellnessCheck {
  id: string;
  user_id: string;
  check_type: string;
  question?: string | null;
  answer?: string | null;
  score?: number | null;
  response_data?: Record<string, any> | null;
  response_time?: number | null;
  is_correct?: boolean;
  created_at?: string | null;
}

export interface UserSettings {
  id: string;
  user_id: string;
  wellness_check_frequency?: number | null;
  two_factor_methods?: any;
  notification_preferences?: any;
  privacy_settings?: any;
  accessibility?: any;
  theme?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BillPayment {
  id: string;
  bill_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method?: string | null;
  confirmation_number?: string | null;
  notes?: string | null;
  created_at?: string | null;
}

export interface PaymentSchedule {
  id: string;
  user_id: string;
  account_id?: string | null;
  payment_name: string;
  frequency: string;
  due_type: string;
  due_day?: number | null;
  due_date?: string | null;
  approximate_timing?: string | null;
  auto_pay?: boolean;
  reminder_enabled?: boolean;
  reminder_days?: number;
  is_active?: boolean;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Delegate {
  id: string;
  user_id: string;
  name: string;
  relationship?: string | null;
  permissions?: string[] | null;
  notes?: string | null;
  notification_message?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DelegateContact {
  id: string;
  delegate_id: string;
  contact_type: string;
  contact_value: string;
  is_verified?: boolean;
  verification_code?: string | null;
  verification_expires_at?: string | null;
  is_primary?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InsurancePolicy {
  id: string;
  user_id: string;
  policy_type: string;
  company_name: string;
  policy_number?: string | null;
  agent_name?: string | null;
  agent_email?: string | null;
  agent_phone?: string | null;
  customer_service_phone?: string | null;
  website_url?: string | null;
  login_username?: string | null;
  premium_amount?: number | null;
  payment_frequency?: string | null;
  due_date_type?: string | null;
  due_date?: string | null;
  due_day_of_month?: number | null;
  due_description?: string | null;
  policy_start_date?: string | null;
  policy_end_date?: string | null;
  deductible?: number | null;
  coverage_details?: string | null;
  notes?: string | null;
  priority?: number;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TaxAccount {
  id: string;
  user_id: string;
  account_type: string;
  entity_name: string;
  account_number?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website_url?: string | null;
  login_username?: string | null;
  tax_year?: number | null;
  filing_status?: string | null;
  important_dates?: string | null;
  document_location?: string | null;
  notes?: string | null;
  priority?: number;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SocialMediaAccount {
  id: string;
  user_id: string;
  platform: string;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  account_url?: string | null;
  recovery_email?: string | null;
  recovery_phone?: string | null;
  two_factor_enabled?: boolean;
  backup_codes?: string | null;
  notes?: string | null;
  priority?: number;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ContactPreference {
  id: string;
  user_id: string;
  reminder_frequency?: string;
  reminder_method?: string;
  user_email?: string | null;
  user_phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  relationship?: string | null;
  days_to_contact?: number;
  is_primary?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface EmailSyncLog {
  id: string;
  user_id: string;
  sync_date?: string;
  emails_processed?: number;
  accounts_found?: number;
  accounts_updated?: number;
  sync_status?: string | null;
  error_message?: string | null;
  sync_details?: Record<string, any> | null;
}

export interface Category {
  id: string;
  user_id?: string | null;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  is_system?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AccountType {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  is_critical?: boolean;
  created_at?: string | null;
}

export type InsertResult<T> = { data: T | null; error: any };

export type SelectResult<T> = { data: T[] | null; error: any };
