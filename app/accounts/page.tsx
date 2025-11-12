"use client";

import { AccountForm } from "@/components/account-form";
import { AccountList } from "@/components/account-list";
import { CategorySelector } from "@/components/category-selector";
import { StatusBar } from "@/components/status-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { createAccountClient, getAccountsByUserClient } from "@/lib/db";
import {
  ArrowLeft,
  Car,
  ChevronDown,
  CreditCard,
  Home,
  Menu,
  Plus,
  Receipt,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [viewingAccount, setViewingAccount] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAccountTypes, setShowAccountTypes] = useState(false);


  useEffect(() => {
    if(user?.id) {
        const handleGetAccountsByUser = async () => {

            try {
                const res = await getAccountsByUserClient(user.id);
                if (res && res.data) {
                    console.log({data:res.data})
                // Use server-returned row (may include server-generated id)
                setAccounts(res.data);
            } else {
                console.log("Failed to create account in DB:", res?.error);
            }
            } catch (error) {
                console.error("Error creating account:", error);
            }
        }

        handleGetAccountsByUser();
    }
  }, [user])

  const handleAddAccount = async (accountData: any) => {
    const newAccount = {
      ...accountData,
    //   id: Date.now().toString(),
      user_id: user.id,
      current_balance: Number.parseFloat(accountData.current_balance) || 0,
      credit_limit: Number.parseFloat(accountData.credit_limit) || undefined,
      priority_level: Number.parseInt(accountData.priority_level),
    };

    // Try to persist to the database via lib/db client wrapper.
    try {
      const res = await createAccountClient({
        // omit local-only fields if needed; db should accept this shape
        ...newAccount,
      });

      if (res && res.data) {
        // Use server-returned row (may include server-generated id)
        setAccounts([...accounts, res.data]);
      } else {
        console.log("Failed to create account in DB:", res?.error);
        // Fallback to local optimistic update
        setAccounts([...accounts, newAccount]);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      // Fallback to local optimistic update
      setAccounts([...accounts, newAccount]);
    }

    setShowForm(false);
    setSelectedCategory("");
  };

  const handleEditAccount = (accountData: any) => {
    const updatedAccount = {
      ...accountData,
      currentBalance: Number.parseFloat(accountData.currentBalance) || 0,
      creditLimit: Number.parseFloat(accountData.creditLimit) || undefined,
      priorityLevel: Number.parseInt(accountData.priorityLevel),
    };
    setAccounts(
      accounts.map((acc) =>
        acc.id === editingAccount.id
          ? { ...updatedAccount, id: editingAccount.id }
          : acc
      )
    );
    setEditingAccount(null);
    setSelectedCategory("");
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
    }
  };

  const handleViewDetails = (account: any) => {
    setViewingAccount(account);
  };

  if (viewingAccount) {
    return (
      <div className="min-h-screen bg-background">
        {user && <StatusBar />}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setViewingAccount(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Accounts
                </Button>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">Account Details</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {viewingAccount?.account_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Account Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {viewingAccount?.account_type}
                    </div>
                    <div>
                      <span className="font-medium">Institution:</span>{" "}
                      {viewingAccount?.institution_name}
                    </div>
                    <div>
                      <span className="font-medium">Account Number:</span> ****
                      {viewingAccount?.account_number}
                    </div>
                    <div>
                      <span className="font-medium">Balance:</span> $
                      {viewingAccount?.current_balance?.toLocaleString()}
                    </div>
                    {viewingAccount?.credit_limit && (
                      <div>
                        <span className="font-medium">Credit Limit:</span> $
                        {viewingAccount?.credit_limit?.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Username:</span>{" "}
                      {viewingAccount?.username}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {viewingAccount?.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {viewingAccount?.phone}
                    </div>
                  </div>
                </div>
              </div>

              {viewingAccount?.notes && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Notes
                  </h3>
                  <p className="text-sm">{viewingAccount?.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setEditingAccount(viewingAccount);
                    setViewingAccount(null);
                  }}
                  className="flex-1"
                >
                  Edit Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewingAccount(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (showForm || editingAccount) {
    return (
      <div className="min-h-screen bg-background">
        {user && <StatusBar />}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAccount(null);
                    setSelectedCategory("");
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Accounts
                </Button>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">
                    {editingAccount ? "Edit Account" : "Add Account"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {!editingAccount && !selectedCategory && (
            <div className="max-w-4xl mx-auto">
              <CategorySelector
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setSelectedCategory("general")}
                  variant="outline"
                  className="text-lg py-4 px-8"
                >
                  Skip Category Selection
                </Button>
              </div>
            </div>
          )}

          {(editingAccount || selectedCategory) && (
            <AccountForm
              onSubmit={editingAccount ? handleEditAccount : handleAddAccount}
              onCancel={() => {
                setShowForm(false);
                setEditingAccount(null);
                setSelectedCategory("");
              }}
              initialData={editingAccount}
              selectedCategory={selectedCategory}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <StatusBar />}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Account Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAccountTypes(!showAccountTypes)}
                className="relative"
              >
                <Menu className="h-4 w-4 mr-2" />
                Account Types
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${
                    showAccountTypes ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>

          {showAccountTypes && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Account Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Banking</p>
                  <p className="text-xs text-muted-foreground">
                    Checking, savings, credit
                  </p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Insurance</p>
                  <p className="text-xs text-muted-foreground">
                    Health, auto, home, life
                  </p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Car className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Transportation</p>
                  <p className="text-xs text-muted-foreground">
                    Cars, gas, transit
                  </p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Home className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Housing</p>
                  <p className="text-xs text-muted-foreground">
                    Mortgage, utilities
                  </p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Receipt className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Tax-Related</p>
                  <p className="text-xs text-muted-foreground">
                    Tax prep, retirement
                  </p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Smartphone className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Subscriptions</p>
                  <p className="text-xs text-muted-foreground">
                    Phone, streaming
                  </p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Professionals</p>
                  <p className="text-xs text-muted-foreground">
                    Doctors, lawyers
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Your Financial Accounts
          </h2>
          <p className="text-muted-foreground">
            Manage all your financial accounts, contact information, and account
            details in one place.
          </p>
        </div>

        <AccountList
          accounts={accounts}
          onEdit={setEditingAccount}
          onDelete={handleDeleteAccount}
          onViewDetails={handleViewDetails}
        />
      </main>
    </div>
  );
}
