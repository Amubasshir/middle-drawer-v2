"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import {
  createDelegate,
  createDelegateContact,
  deleteDelegate,
  deleteDelegateContact,
  getDelegateContactsByDelegate,
  getDelegatesByUser,
  updateDelegate,
  updateDelegateContact,
  withBrowserClient,
} from "@/lib/db";
import type { Delegate as DbDelegate, DelegateContact } from "@/lib/db-types";
import { Edit, Loader2, Plus, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// UI-friendly interface that combines delegate with contacts
interface DelegateUI {
  id: string;
  name: string;
  relationship: string;
  permissions: string[];
  notes: string;
  emails: { id?: string; address: string; verified: boolean }[];
  phones: { id?: string; number: string; verified: boolean }[];
}

export function DelegatesSection() {
  const { user } = useAuth();
  const [delegates, setDelegates] = useState<DelegateUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingDelegate, setIsAddingDelegate] = useState(false);
  const [editingDelegate, setEditingDelegate] = useState<DelegateUI | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [newDelegate, setNewDelegate] = useState<{
    name: string;
    relationship: string;
    permissions: string;
    notes: string;
    notificationMessage: string;
    emails: { id?: string; address: string; verified: boolean }[];
    phones: { id?: string; number: string; verified: boolean }[];
  }>({
    name: "",
    relationship: "",
    permissions: "",
    notes: "",
    notificationMessage: "",
    emails: [{ address: "", verified: false }],
    phones: [{ number: "", verified: false }],
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState<{
    delegateId: string;
    contactId?: string;
    contactType: "email" | "phone";
    contactValue: string;
  } | null>(null);

  // Transform DB delegate + contacts to UI format
  const transformDelegateToUI = (
    delegate: DbDelegate,
    contacts: DelegateContact[]
  ): DelegateUI => {
    const emails = contacts
      .filter((c) => c.contact_type === "email")
      .map((c) => ({
        id: c.id,
        address: c.contact_value,
        verified: c.is_verified || false,
      }));
    const phones = contacts
      .filter((c) => c.contact_type === "phone")
      .map((c) => ({
        id: c.id,
        number: c.contact_value,
        verified: c.is_verified || false,
      }));

    return {
      id: delegate.id,
      name: delegate.name,
      relationship: delegate.relationship || "",
      permissions: delegate.permissions || [],
      notes: delegate.notes || "",
      emails,
      phones,
    };
  };

  // Load delegates from database
  const loadDelegates = useCallback(async () => {
    if (!user || user.id === "guest") {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await withBrowserClient(async (client) => {
        const delegatesResult = await getDelegatesByUser(client, user.id);
        if (delegatesResult.error || !delegatesResult.data) {
          console.error("Error loading delegates:", delegatesResult.error);
          return [];
        }

        // Load contacts for each delegate
        const delegatesWithContacts = await Promise.all(
          delegatesResult.data.map(async (delegate) => {
            const contactsResult = await getDelegateContactsByDelegate(
              client,
              delegate.id
            );
            const contacts = contactsResult.data || [];
            return transformDelegateToUI(delegate, contacts);
          })
        );

        return delegatesWithContacts;
      });

      setDelegates(result);
    } catch (error) {
      console.error("Error loading delegates:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load delegates on mount and when user changes
  useEffect(() => {
    loadDelegates();
  }, [loadDelegates]);

  const addEmailField = () => {
    setNewDelegate({
      ...newDelegate,
      emails: [...newDelegate.emails, { address: "", verified: false }],
    });
  };

  const addPhoneField = () => {
    setNewDelegate({
      ...newDelegate,
      phones: [...newDelegate.phones, { number: "", verified: false }],
    });
  };

  const removeEmailField = (index: number) => {
    setNewDelegate({
      ...newDelegate,
      emails: newDelegate.emails.filter((_, i) => i !== index),
    });
  };

  const removePhoneField = (index: number) => {
    setNewDelegate({
      ...newDelegate,
      phones: newDelegate.phones.filter((_, i) => i !== index),
    });
  };

  const updateEmailField = (index: number, value: string) => {
    const updatedEmails = [...newDelegate.emails];
    updatedEmails[index].address = value;
    setNewDelegate({ ...newDelegate, emails: updatedEmails });
  };

  const updatePhoneField = (index: number, value: string) => {
    const updatedPhones = [...newDelegate.phones];
    updatedPhones[index].number = value;
    setNewDelegate({ ...newDelegate, phones: updatedPhones });
  };

  const sendVerificationCode = async (
    delegateId: string,
    contactId: string | undefined,
    contactType: "email" | "phone",
    contactValue: string
  ) => {
    if (!user || user.id === "guest") return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[v0] Sending verification code ${code} to ${contactValue}`);

    // Store verification code in database
    if (contactId) {
      await withBrowserClient(async (client) => {
        await updateDelegateContact(client, contactId, {
          verification_code: code,
          verification_expires_at: new Date(
            Date.now() + 15 * 60 * 1000
          ).toISOString(), // 15 minutes
        });
      });
    }

    setPendingVerification({
      delegateId,
      contactId,
      contactType,
      contactValue,
    });
  };

  const verifyCode = async () => {
    if (!user || user.id === "guest" || !pendingVerification) return;
    if (verificationCode.length !== 6) return;

    try {
      await withBrowserClient(async (client) => {
        // Find the contact by delegate and value
        const contactsResult = await getDelegateContactsByDelegate(
          client,
          pendingVerification!.delegateId
        );
        if (!contactsResult.data) return;

        const contact = contactsResult.data.find(
          (c) =>
            c.contact_type === pendingVerification!.contactType &&
            c.contact_value === pendingVerification!.contactValue
        );

        if (contact && contact.verification_code === verificationCode) {
          // Verify the contact
          await updateDelegateContact(client, contact.id, {
            is_verified: true,
            verification_code: null,
            verification_expires_at: null,
          });

          // Reload delegates to update UI
          await loadDelegates();
          setPendingVerification(null);
          setVerificationCode("");
        } else {
          alert("Invalid verification code. Please try again.");
        }
      });
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("Error verifying code. Please try again.");
    }
  };

  const handleAddDelegate = async () => {
    if (!user || user.id === "guest") return;

    // Validate required fields
    const validEmails = newDelegate.emails.filter(
      (e) => e.address.trim() !== ""
    );
    const validPhones = newDelegate.phones.filter(
      (p) => p.number.trim() !== ""
    );

    if (
      !newDelegate.name.trim() ||
      validEmails.length === 0 ||
      validPhones.length === 0
    ) {
      alert(
        "Please fill in all required fields (name, at least one email, and at least one phone)"
      );
      return;
    }

    try {
      setIsSaving(true);
      await withBrowserClient(async (client) => {
        // Create delegate
        const permissions = newDelegate.permissions
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== "");

        const delegateResult = await createDelegate(client, {
          user_id: user.id,
          name: newDelegate.name.trim(),
          relationship: newDelegate.relationship.trim() || null,
          permissions: permissions.length > 0 ? permissions : null,
          notes: newDelegate.notes.trim() || null,
          notification_message: newDelegate.notificationMessage.trim() || null,
          is_active: true,
        });

        if (delegateResult.error || !delegateResult.data) {
          console.error("Error creating delegate:", delegateResult.error);
          alert("Error creating delegate. Please try again.");
          return;
        }

        const delegateId = delegateResult.data.id;

        // Create email contacts
        for (let i = 0; i < validEmails.length; i++) {
          await createDelegateContact(client, {
            delegate_id: delegateId,
            contact_type: "email",
            contact_value: validEmails[i].address.trim(),
            is_verified: false,
            is_primary: i === 0,
          });
        }

        // Create phone contacts
        for (let i = 0; i < validPhones.length; i++) {
          await createDelegateContact(client, {
            delegate_id: delegateId,
            contact_type: "phone",
            contact_value: validPhones[i].number.trim(),
            is_verified: false,
            is_primary: i === 0,
          });
        }

        if (newDelegate.notificationMessage.trim()) {
          console.log(
            `[v0] Sending notification to ${newDelegate.name}: ${newDelegate.notificationMessage}`
          );
        }

        // Reload delegates
        await loadDelegates();

        // Reset form
        setNewDelegate({
          name: "",
          relationship: "",
          permissions: "",
          notes: "",
          notificationMessage: "",
          emails: [{ address: "", verified: false }],
          phones: [{ number: "", verified: false }],
        });
        setIsAddingDelegate(false);
      });
    } catch (error) {
      console.error("Error adding delegate:", error);
      alert("Error adding delegate. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDelegate = (delegate: DelegateUI) => {
    setEditingDelegate(delegate);
    setNewDelegate({
      name: delegate.name,
      relationship: delegate.relationship,
      permissions: delegate.permissions.join(", "),
      notes: delegate.notes,
      notificationMessage: "",
      emails: delegate.emails.map((e) => ({
        address: e.address,
        verified: e.verified,
      })),
      phones: delegate.phones.map((p) => ({
        number: p.number,
        verified: p.verified,
      })),
    });
  };

  const handleUpdateDelegate = async () => {
    if (!user || user.id === "guest" || !editingDelegate) return;

    // Validate required fields
    const validEmails = newDelegate.emails.filter(
      (e) => e.address.trim() !== ""
    );
    const validPhones = newDelegate.phones.filter(
      (p) => p.number.trim() !== ""
    );

    if (
      !newDelegate.name.trim() ||
      validEmails.length === 0 ||
      validPhones.length === 0
    ) {
      alert(
        "Please fill in all required fields (name, at least one email, and at least one phone)"
      );
      return;
    }

    try {
      setIsSaving(true);
      await withBrowserClient(async (client) => {
        // Update delegate
        const permissions = newDelegate.permissions
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== "");

        await updateDelegate(client, editingDelegate.id, {
          name: newDelegate.name.trim(),
          relationship: newDelegate.relationship.trim() || null,
          permissions: permissions.length > 0 ? permissions : null,
          notes: newDelegate.notes.trim() || null,
          notification_message: newDelegate.notificationMessage.trim() || null,
        });

        // Get existing contacts
        const contactsResult = await getDelegateContactsByDelegate(
          client,
          editingDelegate.id
        );
        const existingContacts = contactsResult.data || [];

        // Update or create email contacts
        for (let i = 0; i < validEmails.length; i++) {
          const email = validEmails[i];
          const existingContact = existingContacts.find(
            (c) => c.id === email.id && c.contact_type === "email"
          );

          if (existingContact) {
            // Update existing contact
            await updateDelegateContact(client, existingContact.id, {
              contact_value: email.address.trim(),
              is_primary: i === 0,
            });
          } else {
            // Create new contact
            await createDelegateContact(client, {
              delegate_id: editingDelegate.id,
              contact_type: "email",
              contact_value: email.address.trim(),
              is_verified: false,
              is_primary: i === 0,
            });
          }
        }

        // Delete removed email contacts
        const existingEmailIds = existingContacts
          .filter((c) => c.contact_type === "email")
          .map((c) => c.id);
        const newEmailIds = validEmails
          .map((e) => e.id)
          .filter((id): id is string => id !== undefined);
        const emailsToDelete = existingEmailIds.filter(
          (id) => !newEmailIds.includes(id)
        );
        for (const contactId of emailsToDelete) {
          await deleteDelegateContact(client, contactId);
        }

        // Update or create phone contacts
        for (let i = 0; i < validPhones.length; i++) {
          const phone = validPhones[i];
          const existingContact = existingContacts.find(
            (c) => c.id === phone.id && c.contact_type === "phone"
          );

          if (existingContact) {
            // Update existing contact
            await updateDelegateContact(client, existingContact.id, {
              contact_value: phone.number.trim(),
              is_primary: i === 0,
            });
          } else {
            // Create new contact
            await createDelegateContact(client, {
              delegate_id: editingDelegate.id,
              contact_type: "phone",
              contact_value: phone.number.trim(),
              is_verified: false,
              is_primary: i === 0,
            });
          }
        }

        // Delete removed phone contacts
        const existingPhoneIds = existingContacts
          .filter((c) => c.contact_type === "phone")
          .map((c) => c.id);
        const newPhoneIds = validPhones
          .map((p) => p.id)
          .filter((id): id is string => id !== undefined);
        const phonesToDelete = existingPhoneIds.filter(
          (id) => !newPhoneIds.includes(id)
        );
        for (const contactId of phonesToDelete) {
          await deleteDelegateContact(client, contactId);
        }

        if (newDelegate.notificationMessage.trim()) {
          console.log(
            `[v0] Sending update notification to ${newDelegate.name}: ${newDelegate.notificationMessage}`
          );
        }

        // Reload delegates
        await loadDelegates();

        setEditingDelegate(null);
        setNewDelegate({
          name: "",
          relationship: "",
          permissions: "",
          notes: "",
          notificationMessage: "",
          emails: [{ address: "", verified: false }],
          phones: [{ number: "", verified: false }],
        });
      });
    } catch (error) {
      console.error("Error updating delegate:", error);
      alert("Error updating delegate. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDelegate = async (delegateId: string) => {
    if (!user || user.id === "guest") return;
    if (!confirm("Are you sure you want to delete this delegate?")) return;

    try {
      await withBrowserClient(async (client) => {
        // Delete delegate (contacts will be deleted via cascade)
        const result = await deleteDelegate(client, delegateId);
        if (result.error) {
          console.error("Error deleting delegate:", result.error);
          alert("Error deleting delegate. Please try again.");
          return;
        }

        // Reload delegates
        await loadDelegates();
      });
    } catch (error) {
      console.error("Error deleting delegate:", error);
      alert("Error deleting delegate. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            <CardTitle className="text-2xl">Authorized Delegates</CardTitle>
          </div>
          <Dialog open={isAddingDelegate} onOpenChange={setIsAddingDelegate}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-xl py-4 px-6"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Delegate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Delegate</DialogTitle>
                <DialogDescription className="text-lg">
                  Add someone who can act on your behalf in specific situations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDelegate.name}
                    onChange={(e) =>
                      setNewDelegate({ ...newDelegate, name: e.target.value })
                    }
                    placeholder="Full name"
                    className="text-lg py-3"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship" className="text-lg">
                    Relationship
                  </Label>
                  <Input
                    id="relationship"
                    value={newDelegate.relationship}
                    onChange={(e) =>
                      setNewDelegate({
                        ...newDelegate,
                        relationship: e.target.value,
                      })
                    }
                    placeholder="Spouse, Family, Friend, etc."
                    className="text-lg py-3"
                  />
                </div>
                <div>
                  <Label className="text-lg">
                    Email Addresses (at least 1 required)
                  </Label>
                  {newDelegate.emails.map((email, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={email.address}
                        onChange={(e) =>
                          updateEmailField(index, e.target.value)
                        }
                        placeholder="email@example.com"
                        className="text-lg py-3"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          sendVerificationCode(
                            "new",
                            undefined,
                            "email",
                            email.address
                          )
                        }
                        disabled={true}
                        className="text-lg"
                        title="Verify after creating the delegate"
                      >
                        Verify
                      </Button>
                      {newDelegate.emails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeEmailField(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmailField}
                    className="mt-2 text-lg bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </div>
                <div>
                  <Label className="text-lg">
                    Phone Numbers (at least 1 required)
                  </Label>
                  {newDelegate.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={phone.number}
                        onChange={(e) =>
                          updatePhoneField(index, e.target.value)
                        }
                        placeholder="(555) 123-4567"
                        className="text-lg py-3"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          sendVerificationCode(
                            "new",
                            undefined,
                            "phone",
                            phone.number
                          )
                        }
                        disabled={true}
                        className="text-lg"
                        title="Verify after creating the delegate"
                      >
                        Verify
                      </Button>
                      {newDelegate.phones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removePhoneField(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPhoneField}
                    className="mt-2 text-lg bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Phone
                  </Button>
                </div>
                <div>
                  <Label htmlFor="permissions" className="text-lg">
                    Permissions (comma separated)
                  </Label>
                  <Input
                    id="permissions"
                    value={newDelegate.permissions}
                    onChange={(e) =>
                      setNewDelegate({
                        ...newDelegate,
                        permissions: e.target.value,
                      })
                    }
                    placeholder="Financial, Medical, Emergency Only, Full Access"
                    className="text-lg py-3"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-lg">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newDelegate.notes}
                    onChange={(e) =>
                      setNewDelegate({ ...newDelegate, notes: e.target.value })
                    }
                    placeholder="Special instructions or limitations"
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="notificationMessage" className="text-lg">
                    Notification Message (optional)
                  </Label>
                  <Textarea
                    id="notificationMessage"
                    value={newDelegate.notificationMessage}
                    onChange={(e) =>
                      setNewDelegate({
                        ...newDelegate,
                        notificationMessage: e.target.value,
                      })
                    }
                    placeholder="Message to send to the delegate about their new role"
                    className="text-lg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingDelegate(false)}
                  className="text-lg py-3 px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddDelegate}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-6"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Delegate"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-lg">
          People authorized to access your accounts and make decisions on your
          behalf
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : delegates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg">No delegates added yet.</p>
            <p className="text-base">Add your first delegate to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {delegates.map((delegate) => (
              <div
                key={delegate.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-xl">{delegate.name}</span>
                    <Badge variant="outline" className="text-sm">
                      {delegate.relationship}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <p className="text-lg font-medium mb-1">
                      Contact Information:
                    </p>
                    <div className="space-y-1">
                      {delegate.emails.map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-base">{email.address}</span>
                          <Badge
                            variant={email.verified ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {email.verified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                      ))}
                      {delegate.phones.map((phone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-base">{phone.number}</span>
                          <Badge
                            variant={phone.verified ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {phone.verified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {delegate.permissions.map((permission, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  {delegate.notes && (
                    <p className="text-base text-muted-foreground">
                      {delegate.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="ghost"
                    // onClick={() => handleEditDelegate(delegate)}
                    className="text-lg"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    // onClick={() => handleDeleteDelegate(delegate.id)}
                    className="text-red-600 hover:text-red-700 text-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog
        open={!!pendingVerification}
        onOpenChange={() => setPendingVerification(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Verify Contact Information
            </DialogTitle>
            <DialogDescription className="text-lg">
              Enter the 6-digit code sent to {pendingVerification?.contactValue}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-2xl text-center py-4"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingVerification(null)}
              className="text-lg py-3 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={verifyCode}
              disabled={verificationCode.length !== 6}
              className="text-lg py-3 px-6"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!editingDelegate}
        onOpenChange={() => setEditingDelegate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Delegate</DialogTitle>
            <DialogDescription className="text-lg">
              Update delegate information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="edit-name" className="text-lg">
                Name
              </Label>
              <Input
                id="edit-name"
                value={newDelegate.name}
                onChange={(e) =>
                  setNewDelegate({ ...newDelegate, name: e.target.value })
                }
                placeholder="Full name"
                className="text-lg py-3"
              />
            </div>
            <div>
              <Label htmlFor="edit-relationship" className="text-lg">
                Relationship
              </Label>
              <Input
                id="edit-relationship"
                value={newDelegate.relationship}
                onChange={(e) =>
                  setNewDelegate({
                    ...newDelegate,
                    relationship: e.target.value,
                  })
                }
                placeholder="Spouse, Family, Friend, etc."
                className="text-lg py-3"
              />
            </div>
            <div>
              <Label className="text-lg">
                Email Addresses (at least 1 required)
              </Label>
              {newDelegate.emails.map((email, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={email.address}
                    onChange={(e) => updateEmailField(index, e.target.value)}
                    placeholder="email@example.com"
                    className="text-lg py-3"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      sendVerificationCode(
                        editingDelegate!.id,
                        email.id,
                        "email",
                        email.address
                      )
                    }
                    disabled={!email.address.includes("@")}
                    className="text-lg"
                  >
                    {email.verified ? "Verified" : "Verify"}
                  </Button>
                  {newDelegate.emails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeEmailField(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addEmailField}
                className="mt-2 text-lg bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
            </div>
            <div>
              <Label className="text-lg">
                Phone Numbers (at least 1 required)
              </Label>
              {newDelegate.phones.map((phone, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={phone.number}
                    onChange={(e) => updatePhoneField(index, e.target.value)}
                    placeholder="(555) 123-4567"
                    className="text-lg py-3"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      sendVerificationCode(
                        editingDelegate!.id,
                        phone.id,
                        "phone",
                        phone.number
                      )
                    }
                    disabled={phone.number.length < 10}
                    className="text-lg"
                  >
                    {phone.verified ? "Verified" : "Verify"}
                  </Button>
                  {newDelegate.phones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removePhoneField(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPhoneField}
                className="mt-2 text-lg bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone
              </Button>
            </div>
            <div>
              <Label htmlFor="edit-permissions" className="text-lg">
                Permissions (comma separated)
              </Label>
              <Input
                id="edit-permissions"
                value={newDelegate.permissions}
                onChange={(e) =>
                  setNewDelegate({
                    ...newDelegate,
                    permissions: e.target.value,
                  })
                }
                placeholder="Financial, Medical, Emergency Only, Full Access"
                className="text-lg py-3"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes" className="text-lg">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                value={newDelegate.notes}
                onChange={(e) =>
                  setNewDelegate({ ...newDelegate, notes: e.target.value })
                }
                placeholder="Special instructions or limitations"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="edit-notificationMessage" className="text-lg">
                Update Notification Message (optional)
              </Label>
              <Textarea
                id="edit-notificationMessage"
                value={newDelegate.notificationMessage}
                onChange={(e) =>
                  setNewDelegate({
                    ...newDelegate,
                    notificationMessage: e.target.value,
                  })
                }
                placeholder="Message to send to the delegate about the updates"
                className="text-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingDelegate(null)}
              className="text-lg py-3 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDelegate}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-6"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Delegate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
