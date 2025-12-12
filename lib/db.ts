import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Account,
  AccountType,
  Bill,
  BillPayment,
  Category,
  ContactPreference,
  Delegate,
  DelegateContact,
  EmailSyncLog,
  EmergencyContact,
  InsertResult,
  InsurancePolicy,
  PaymentSchedule,
  PersonalNote,
  Profile,
  SelectResult,
  SocialMediaAccount,
  TaxAccount,
  UserSettings,
  WellnessCheck,
} from "./db-types";
import { createClient as createBrowserClient } from "./supabase/client";
import { createClient as createServerClient } from "./supabase/server";

// ============================================================================
// Client helpers - for browser/client-side usage
// ============================================================================

// Convenience helper to use a browser client when a client isn't provided.
export function withBrowserClient<T>(
  fn: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const client = createBrowserClient();
  return fn(client as SupabaseClient);
}

// Convenience helper to use a server client when a client isn't provided.
export async function withServerClient<T>(
  fn: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const client = await createBrowserClient();
  return fn(client as SupabaseClient);
}

// ============================================================================
// Generic CRUD helpers
// ============================================================================

// These accept a Supabase client so they work both in server code,
// client code, and in tests (mock client).

export async function insertRow<T = any>(
  client: SupabaseClient,
  table: string,
  row: Partial<T>
): Promise<InsertResult<T>> {
  const { data, error } = await (client as any)
    .from(table)
    .insert(row)
    .select();
  return { data: (data && (data[0] as T)) || null, error };
}

export async function insertRows<T = any>(
  client: SupabaseClient,
  table: string,
  rows: Partial<T>[]
): Promise<SelectResult<T>> {
  const { data, error } = await (client as any)
    .from(table)
    .insert(rows)
    .select();
  return { data: data || null, error };
}

export async function selectAll<T = any>(
  client: SupabaseClient,
  table: string,
  eq?: Record<string, any>
): Promise<SelectResult<T>> {
  let q = (client as any).from(table).select("*");
  if (eq) {
    Object.entries(eq).forEach(([k, v]) => {
      q = q.eq(k, v as any);
    });
  }
  const { data, error } = await q;
  return { data: data || null, error };
}

export async function selectCount(
  client: SupabaseClient,
  table: string,
  eq?: Record<string, any>
) {
  let q = client.from(table).select("*", { count: "exact", head: true });

  if (eq) {
    Object.entries(eq).forEach(([k, v]) => {
      q = q.eq(k, v);
    });
  }

  const { count, error } = await q;
  return { count: count ?? 0, error };
}


export async function selectById<T = any>(
  client: SupabaseClient,
  table: string,
  id: string
): Promise<InsertResult<T>> {
  const { data, error } = await (client as any)
    .from(table)
    .select("*")
    .eq("id", id)
    .limit(1);
  return { data: (data && (data[0] as T)) || null, error };
}

export async function updateById<T = any>(
  client: SupabaseClient,
  table: string,
  id: string,
  patch: Partial<T>
): Promise<InsertResult<T>> {
  const { data, error } = await (client as any)
    .from(table)
    .update(patch)
    .eq("id", id)
    .select();
  return { data: (data && (data[0] as T)) || null, error };
}

export async function deleteById(
  client: SupabaseClient,
  table: string,
  id: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await client
    .from(table)
    .delete()
    .eq("id", id)
    .select();
  return { data, error };
}

// ============================================================================
// Profiles
// ============================================================================

export async function getProfileById(client: SupabaseClient, id: string) {
  return selectById<Profile>(client, "profiles", id);
}

export async function upsertProfile(
  client: SupabaseClient,
  profile: Partial<Profile>
) {
  const { data, error } = await (client as any)
    .from("profiles")
    .upsert(profile)
    .select();
  return { data: (data && (data[0] as Profile)) || null, error };
}

// ============================================================================
// Accounts
// ============================================================================

export async function getAccountsByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<Account>(client, "accounts", { user_id });
}

export async function getAccountById(client: SupabaseClient, id: string) {
  return selectById<Account>(client, "accounts", id);
}

export async function createAccount(
  client: SupabaseClient,
  account: Partial<Account>
) {
  return insertRow<Account>(client, "accounts", account);
}

export async function updateAccount(
  client: SupabaseClient,
  id: string,
  patch: Partial<Account>
) {
  return updateById<Account>(client, "accounts", id, patch);
}

export async function deleteAccount(client: SupabaseClient, id: string) {
  return deleteById(client, "accounts", id);
}

// ============================================================================
// Account Types
// ============================================================================

export async function getAccountTypes(client: SupabaseClient) {
  return selectAll<AccountType>(client, "account_types");
}

export async function getAccountTypeById(client: SupabaseClient, id: string) {
  return selectById<AccountType>(client, "account_types", id);
}

export async function createAccountType(
  client: SupabaseClient,
  accountType: Partial<AccountType>
) {
  return insertRow<AccountType>(client, "account_types", accountType);
}

export async function updateAccountType(
  client: SupabaseClient,
  id: string,
  patch: Partial<AccountType>
) {
  return updateById<AccountType>(client, "account_types", id, patch);
}

export async function deleteAccountType(client: SupabaseClient, id: string) {
  return deleteById(client, "account_types", id);
}

// ============================================================================
// Bills
// ============================================================================

export async function getBillsByUser(client: SupabaseClient, user_id: string) {
  return selectAll<Bill>(client, "bills", { user_id });
}

export async function getBillById(client: SupabaseClient, id: string) {
  return selectById<Bill>(client, "bills", id);
}

export async function createBill(client: SupabaseClient, bill: Partial<Bill>) {
  return insertRow<Bill>(client, "bills", bill);
}

export async function updateBill(
  client: SupabaseClient,
  id: string,
  patch: Partial<Bill>
) {
  return updateById<Bill>(client, "bills", id, patch);
}

export async function deleteBill(client: SupabaseClient, id: string) {
  return deleteById(client, "bills", id);
}

// ============================================================================
// Bill Payments
// ============================================================================

export async function getBillPaymentsByBill(
  client: SupabaseClient,
  bill_id: string
) {
  return selectAll<BillPayment>(client, "bill_payments", { bill_id });
}

export async function getBillPaymentById(client: SupabaseClient, id: string) {
  return selectById<BillPayment>(client, "bill_payments", id);
}

export async function createBillPayment(
  client: SupabaseClient,
  payment: Partial<BillPayment>
) {
  return insertRow<BillPayment>(client, "bill_payments", payment);
}

export async function updateBillPayment(
  client: SupabaseClient,
  id: string,
  patch: Partial<BillPayment>
) {
  return updateById<BillPayment>(client, "bill_payments", id, patch);
}

export async function deleteBillPayment(client: SupabaseClient, id: string) {
  return deleteById(client, "bill_payments", id);
}

// ============================================================================
// Payment Schedules
// ============================================================================

export async function getPaymentSchedulesByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<PaymentSchedule>(client, "payment_schedules", { user_id });
}

export async function getPaymentSchedulesByAccount(
  client: SupabaseClient,
  account_id: string
) {
  return selectAll<PaymentSchedule>(client, "payment_schedules", {
    account_id,
  });
}

export async function getPaymentScheduleById(
  client: SupabaseClient,
  id: string
) {
  return selectById<PaymentSchedule>(client, "payment_schedules", id);
}

export async function createPaymentSchedule(
  client: SupabaseClient,
  schedule: Partial<PaymentSchedule>
) {
  return insertRow<PaymentSchedule>(client, "payment_schedules", schedule);
}

export async function updatePaymentSchedule(
  client: SupabaseClient,
  id: string,
  patch: Partial<PaymentSchedule>
) {
  return updateById<PaymentSchedule>(client, "payment_schedules", id, patch);
}

export async function deletePaymentSchedule(
  client: SupabaseClient,
  id: string
) {
  return deleteById(client, "payment_schedules", id);
}

// ============================================================================
// Delegates
// ============================================================================

export async function getDelegatesByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<Delegate>(client, "delegates", { user_id });
}

export async function getDelegateById(client: SupabaseClient, id: string) {
  return selectById<Delegate>(client, "delegates", id);
}

export async function createDelegate(
  client: SupabaseClient,
  delegate: Partial<Delegate>
) {
  return insertRow<Delegate>(client, "delegates", delegate);
}

export async function updateDelegate(
  client: SupabaseClient,
  id: string,
  patch: Partial<Delegate>
) {
  return updateById<Delegate>(client, "delegates", id, patch);
}

export async function deleteDelegate(client: SupabaseClient, id: string) {
  return deleteById(client, "delegates", id);
}

// ============================================================================
// Delegate Contacts
// ============================================================================

export async function getDelegateContactsByDelegate(
  client: SupabaseClient,
  delegate_id: string
) {
  return selectAll<DelegateContact>(client, "delegate_contacts", {
    delegate_id,
  });
}

export async function getDelegateContactsCountsByDelegate(
  client: SupabaseClient,
  delegate_id: string
) {
  // Total count
  const { count: totalCount, error: totalError } = await client
    .from("delegate_contacts")
    .select("*", { count: "exact", head: true })
    .eq("delegate_id", delegate_id);

  // Verified count
  const { count: verifiedCount, error: verifiedError } = await client
    .from("delegate_contacts")
    .select("*", { count: "exact", head: true })
    .eq("delegate_id", delegate_id)
    .eq("is_verified", true);

  return {
    totalCount: totalCount ?? 0,
    verifiedCount: verifiedCount ?? 0,
    error: totalError || verifiedError,
  };
}

export async function getDelegateContactById(
  client: SupabaseClient,
  id: string
) {
  return selectById<DelegateContact>(client, "delegate_contacts", id);
}

export async function createDelegateContact(
  client: SupabaseClient,
  contact: Partial<DelegateContact>
) {
  return insertRow<DelegateContact>(client, "delegate_contacts", contact);
}

export async function updateDelegateContact(
  client: SupabaseClient,
  id: string,
  patch: Partial<DelegateContact>
) {
  return updateById<DelegateContact>(client, "delegate_contacts", id, patch);
}

export async function deleteDelegateContact(
  client: SupabaseClient,
  id: string
) {
  return deleteById(client, "delegate_contacts", id);
}

// ============================================================================
// Personal Notes
// ============================================================================

export async function getNotesByUser(client: SupabaseClient, user_id: string) {
  return selectAll<PersonalNote>(client, "personal_notes", { user_id });
}

export async function getNoteById(client: SupabaseClient, id: string) {
  return selectById<PersonalNote>(client, "personal_notes", id);
}

export async function createNote(
  client: SupabaseClient,
  note: Partial<PersonalNote>
) {
  return insertRow<PersonalNote>(client, "personal_notes", note);
}

export async function updateNote(
  client: SupabaseClient,
  id: string,
  patch: Partial<PersonalNote>
) {
  return updateById<PersonalNote>(client, "personal_notes", id, patch);
}

export async function deleteNote(client: SupabaseClient, id: string) {
  return deleteById(client, "personal_notes", id);
}

// ============================================================================
// Wellness Checks
// ============================================================================

export async function getWellnessChecksByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<WellnessCheck>(client, "wellness_checks", { user_id });
}

export async function getWellnessCheckById(client: SupabaseClient, id: string) {
  return selectById<WellnessCheck>(client, "wellness_checks", id);
}

export async function createWellnessCheck(
  client: SupabaseClient,
  check: Partial<WellnessCheck>
) {
  return insertRow<WellnessCheck>(client, "wellness_checks", check);
}

export async function updateWellnessCheck(
  client: SupabaseClient,
  id: string,
  patch: Partial<WellnessCheck>
) {
  return updateById<WellnessCheck>(client, "wellness_checks", id, patch);
}

export async function deleteWellnessCheck(client: SupabaseClient, id: string) {
  return deleteById(client, "wellness_checks", id);
}

// ============================================================================
// User Settings
// ============================================================================

export async function getUserSettings(client: SupabaseClient, user_id: string) {
  const res = await selectAll<UserSettings>(client, "user_settings", {
    user_id,
  });
  return res;
}

export async function getUserSettingsById(client: SupabaseClient, id: string) {
  return selectById<UserSettings>(client, "user_settings", id);
}

export async function upsertUserSettings(
  client: SupabaseClient,
  settings: Partial<UserSettings>
) {
  const { data, error } = await (client as any)
    .from("user_settings")
    .upsert(settings)
    .select();
  return { data: (data && (data[0] as UserSettings)) || null, error };
}

// ============================================================================
// Insurance Policies
// ============================================================================

export async function getInsurancePoliciesByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<InsurancePolicy>(client, "insurance_policies", {
    user_id,
  });
}

export async function getInsurancePolicyById(
  client: SupabaseClient,
  id: string
) {
  return selectById<InsurancePolicy>(client, "insurance_policies", id);
}

export async function createInsurancePolicy(
  client: SupabaseClient,
  policy: Partial<InsurancePolicy>
) {
  return insertRow<InsurancePolicy>(client, "insurance_policies", policy);
}

export async function updateInsurancePolicy(
  client: SupabaseClient,
  id: string,
  patch: Partial<InsurancePolicy>
) {
  return updateById<InsurancePolicy>(client, "insurance_policies", id, patch);
}

export async function deleteInsurancePolicy(
  client: SupabaseClient,
  id: string
) {
  return deleteById(client, "insurance_policies", id);
}

// ============================================================================
// Tax Accounts
// ============================================================================

export async function getTaxAccountsByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<TaxAccount>(client, "tax_accounts", { user_id });
}

export async function getTaxAccountById(client: SupabaseClient, id: string) {
  return selectById<TaxAccount>(client, "tax_accounts", id);
}

export async function createTaxAccount(
  client: SupabaseClient,
  account: Partial<TaxAccount>
) {
  return insertRow<TaxAccount>(client, "tax_accounts", account);
}

export async function updateTaxAccount(
  client: SupabaseClient,
  id: string,
  patch: Partial<TaxAccount>
) {
  return updateById<TaxAccount>(client, "tax_accounts", id, patch);
}

export async function deleteTaxAccount(client: SupabaseClient, id: string) {
  return deleteById(client, "tax_accounts", id);
}

// ============================================================================
// Social Media Accounts
// ============================================================================

export async function getSocialMediaAccountsByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<SocialMediaAccount>(client, "social_media_accounts", {
    user_id,
  });
}

export async function getSocialMediaAccountById(
  client: SupabaseClient,
  id: string
) {
  return selectById<SocialMediaAccount>(client, "social_media_accounts", id);
}

export async function createSocialMediaAccount(
  client: SupabaseClient,
  account: Partial<SocialMediaAccount>
) {
  return insertRow<SocialMediaAccount>(
    client,
    "social_media_accounts",
    account
  );
}

export async function updateSocialMediaAccount(
  client: SupabaseClient,
  id: string,
  patch: Partial<SocialMediaAccount>
) {
  return updateById<SocialMediaAccount>(
    client,
    "social_media_accounts",
    id,
    patch
  );
}

export async function deleteSocialMediaAccount(
  client: SupabaseClient,
  id: string
) {
  return deleteById(client, "social_media_accounts", id);
}

// ============================================================================
// Contact Preferences
// ============================================================================

export async function getContactPreferencesByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<ContactPreference>(client, "contact_preferences", {
    user_id,
  });
}

export async function getContactPreferenceById(
  client: SupabaseClient,
  id: string
) {
  return selectById<ContactPreference>(client, "contact_preferences", id);
}

export async function upsertContactPreference(
  client: SupabaseClient,
  preference: Partial<ContactPreference>
) {
  const { data, error } = await (client as any)
    .from("contact_preferences")
    .upsert(preference)
    .select();
  return {
    data: (data && (data[0] as ContactPreference)) || null,
    error,
  };
}

export async function updateContactPreference(
  client: SupabaseClient,
  id: string,
  patch: Partial<ContactPreference>
) {
  return updateById<ContactPreference>(
    client,
    "contact_preferences",
    id,
    patch
  );
}

export async function deleteContactPreference(
  client: SupabaseClient,
  id: string
) {
  return deleteById(client, "contact_preferences", id);
}

// ============================================================================
// Emergency Contacts
// ============================================================================

export async function getEmergencyContactsByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<EmergencyContact>(client, "emergency_contacts", {
    user_id,
  });
}

export async function getEmergencyContactById(
  client: SupabaseClient,
  id: string
) {
  return selectById<EmergencyContact>(client, "emergency_contacts", id);
}

export async function createEmergencyContact(
  client: SupabaseClient,
  contact: Partial<EmergencyContact>
) {
  return insertRow<EmergencyContact>(client, "emergency_contacts", contact);
}

export async function updateEmergencyContact(
  client: SupabaseClient,
  id: string,
  patch: Partial<EmergencyContact>
) {
  return updateById<EmergencyContact>(client, "emergency_contacts", id, patch);
}

export async function deleteEmergencyContact(
  client: SupabaseClient,
  id: string
) {
  return deleteById(client, "emergency_contacts", id);
}

// ============================================================================
// Email Sync Log
// ============================================================================

export async function getEmailSyncLogsByUser(
  client: SupabaseClient,
  user_id: string
) {
  return selectAll<EmailSyncLog>(client, "email_sync_log", { user_id });
}

export async function getEmailSyncLogById(client: SupabaseClient, id: string) {
  return selectById<EmailSyncLog>(client, "email_sync_log", id);
}

export async function createEmailSyncLog(
  client: SupabaseClient,
  log: Partial<EmailSyncLog>
) {
  return insertRow<EmailSyncLog>(client, "email_sync_log", log);
}

export async function updateEmailSyncLog(
  client: SupabaseClient,
  id: string,
  patch: Partial<EmailSyncLog>
) {
  return updateById<EmailSyncLog>(client, "email_sync_log", id, patch);
}

export async function deleteEmailSyncLog(client: SupabaseClient, id: string) {
  return deleteById(client, "email_sync_log", id);
}

// ============================================================================
// Categories
// ============================================================================

export async function getCategoriesByUser(
  client: SupabaseClient,
  user_id?: string
) {
  if (user_id) {
    return selectAll<Category>(client, "categories", { user_id });
  }
  // Get system categories (user_id is null)
  const { data, error } = await (client as any)
    .from("categories")
    .select("*")
    .is("user_id", null)
    .eq("is_system", true);
  return { data: data || null, error };
}

export async function getCategoryById(client: SupabaseClient, id: string) {
  return selectById<Category>(client, "categories", id);
}

export async function createCategory(
  client: SupabaseClient,
  category: Partial<Category>
) {
  return insertRow<Category>(client, "categories", category);
}

export async function updateCategory(
  client: SupabaseClient,
  id: string,
  patch: Partial<Category>
) {
  return updateById<Category>(client, "categories", id, patch);
}

export async function deleteCategory(client: SupabaseClient, id: string) {
  return deleteById(client, "categories", id);
}

// ============================================================================
// Client-side convenience wrappers (use browser client)
// ============================================================================

export async function getProfileByIdClient(id: string) {
  return withBrowserClient((c) => getProfileById(c as SupabaseClient, id));
}

export async function upsertProfileClient(profile: Partial<Profile>) {
  return withBrowserClient((c) => upsertProfile(c as SupabaseClient, profile));
}

export async function getAccountsByUserClient(user_id: string) {
  return withBrowserClient((c) =>
    getAccountsByUser(c as SupabaseClient, user_id)
  );
}

export async function createAccountClient(account: Partial<Account>) {
  return withBrowserClient((c) => createAccount(c as SupabaseClient, account));
}

export async function updateAccountClient(id: string, patch: Partial<Account>) {
  return withBrowserClient((c) =>
    updateAccount(c as SupabaseClient, id, patch)
  );
}

export async function deleteAccountClient(id: string) {
  return withBrowserClient((c) => deleteAccount(c as SupabaseClient, id));
}

export async function getBillsByUserClient(user_id: string) {
  return withBrowserClient((c) => getBillsByUser(c as SupabaseClient, user_id));
}

export async function createBillClient(bill: Partial<Bill>) {
  return withBrowserClient((c) => createBill(c as SupabaseClient, bill));
}

export async function updateBillClient(id: string, patch: Partial<Bill>) {
  return withBrowserClient((c) => updateBill(c as SupabaseClient, id, patch));
}

export async function deleteBillClient(id: string) {
  return withBrowserClient((c) => deleteBill(c as SupabaseClient, id));
}

export async function getNotesByUserClient(user_id: string) {
  return withBrowserClient((c) => getNotesByUser(c as SupabaseClient, user_id));
}

export async function createNoteClient(note: Partial<PersonalNote>) {
  return withBrowserClient((c) => createNote(c as SupabaseClient, note));
}

export async function updateNoteClient(
  id: string,
  patch: Partial<PersonalNote>
) {
  return withBrowserClient((c) => updateNote(c as SupabaseClient, id, patch));
}

export async function deleteNoteClient(id: string) {
  return withBrowserClient((c) => deleteNote(c as SupabaseClient, id));
}

export async function getWellnessChecksByUserClient(user_id: string) {
  return withBrowserClient((c) =>
    getWellnessChecksByUser(c as SupabaseClient, user_id)
  );
}

export async function createWellnessCheckClient(check: Partial<WellnessCheck>) {
  return withBrowserClient((c) =>
    createWellnessCheck(c as SupabaseClient, check)
  );
}

export async function getUserSettingsClient(user_id: string) {
  return withBrowserClient((c) =>
    getUserSettings(c as SupabaseClient, user_id)
  );
}

export async function upsertUserSettingsClient(
  settings: Partial<UserSettings>
) {
  return withBrowserClient((c) =>
    upsertUserSettings(c as SupabaseClient, settings)
  );
}

// ============================================================================
// Server-side convenience wrappers (use server client)
// ============================================================================

export async function getProfileByIdServer(id: string) {
  return withServerClient((c) => getProfileById(c as SupabaseClient, id));
}

export async function upsertProfileServer(profile: Partial<Profile>) {
  return withServerClient((c) => upsertProfile(c as SupabaseClient, profile));
}

export async function getAccountsByUserServer(user_id: string) {
  return withServerClient((c) =>
    getAccountsByUser(c as SupabaseClient, user_id)
  );
}

export async function createAccountServer(account: Partial<Account>) {
  return withServerClient((c) => createAccount(c as SupabaseClient, account));
}

export async function updateAccountServer(id: string, patch: Partial<Account>) {
  return withServerClient((c) => updateAccount(c as SupabaseClient, id, patch));
}

export async function deleteAccountServer(id: string) {
  return withServerClient((c) => deleteAccount(c as SupabaseClient, id));
}

export async function createBillServer(bill: Partial<Bill>) {
  return withServerClient((c) => createBill(c as SupabaseClient, bill));
}

export async function createNoteServer(note: Partial<PersonalNote>) {
  return withServerClient((c) => createNote(c as SupabaseClient, note));
}

// ============================================================================
// Default export
// ============================================================================

export default {
  // generic
  insertRow,
  insertRows,
  selectAll,
  selectById,
  updateById,
  deleteById,
  // profiles
  getProfileById,
  upsertProfile,
  // accounts
  getAccountsByUser,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  // account types
  getAccountTypes,
  getAccountTypeById,
  createAccountType,
  updateAccountType,
  deleteAccountType,
  // bills
  getBillsByUser,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  // bill payments
  getBillPaymentsByBill,
  getBillPaymentById,
  createBillPayment,
  updateBillPayment,
  deleteBillPayment,
  // payment schedules
  getPaymentSchedulesByUser,
  getPaymentSchedulesByAccount,
  getPaymentScheduleById,
  createPaymentSchedule,
  updatePaymentSchedule,
  deletePaymentSchedule,
  // delegates
  getDelegatesByUser,
  getDelegateById,
  createDelegate,
  updateDelegate,
  deleteDelegate,
  // delegate contacts
  getDelegateContactsByDelegate,
  getDelegateContactById,
  createDelegateContact,
  updateDelegateContact,
  deleteDelegateContact,
  // notes
  getNotesByUser,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  // wellness
  getWellnessChecksByUser,
  getWellnessCheckById,
  createWellnessCheck,
  updateWellnessCheck,
  deleteWellnessCheck,
  // settings
  getUserSettings,
  getUserSettingsById,
  upsertUserSettings,
  // insurance policies
  getInsurancePoliciesByUser,
  getInsurancePolicyById,
  createInsurancePolicy,
  updateInsurancePolicy,
  deleteInsurancePolicy,
  // tax accounts
  getTaxAccountsByUser,
  getTaxAccountById,
  createTaxAccount,
  updateTaxAccount,
  deleteTaxAccount,
  // social media accounts
  getSocialMediaAccountsByUser,
  getSocialMediaAccountById,
  createSocialMediaAccount,
  updateSocialMediaAccount,
  deleteSocialMediaAccount,
  // contact preferences
  getContactPreferencesByUser,
  getContactPreferenceById,
  upsertContactPreference,
  updateContactPreference,
  deleteContactPreference,
  // emergency contacts
  getEmergencyContactsByUser,
  getEmergencyContactById,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  // email sync log
  getEmailSyncLogsByUser,
  getEmailSyncLogById,
  createEmailSyncLog,
  updateEmailSyncLog,
  deleteEmailSyncLog,
  // categories
  getCategoriesByUser,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
