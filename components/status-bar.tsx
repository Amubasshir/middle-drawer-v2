"use client"

import { useAuth } from "@/contexts/auth-context";
import { getDelegateContactsCountsByDelegate, getDelegatesByUser, withBrowserClient } from "@/lib/db";
import { useCallback, useEffect, useState } from "react";

export function StatusBar() {
    const { user } = useAuth();
    const [contactCount, setContactCount] = useState({
        totalCount: 0,
        verifiedCount: 0,
    });
      // Load delegates from database
  const loadDelegates = useCallback(async () => {
    if (!user || user.id === "guest") {
      return;
    }

    try {
      const result = await withBrowserClient(async (client) => {
        const delegatesResult = await getDelegatesByUser(client, user.id);
        if (delegatesResult.error || !delegatesResult.data) {
          console.error("Error loading delegates:", delegatesResult.error);
          return [];
        }

        // Load contacts for each delegate
        const delegatesWithContacts = await Promise.all(
          delegatesResult.data.map(async (delegate) => {
            const contactsResult = await getDelegateContactsCountsByDelegate(
              client,
              delegate.id
            );
            return contactsResult;
          })
        );

        return delegatesWithContacts;
      });

      setContactCount(result[0]);
    //   setDelegates(result);
    } catch (error) {
      console.error("Error loading delegates:", error);
    } finally {
        
    }
  }, [user]);

  // Load delegates on mount and when user changes
  useEffect(() => {
    loadDelegates();
  }, [loadDelegates]);

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Status: Active</span>
            </div>
            <div className="text-muted-foreground">Last wellness check: 2 days ago</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-muted-foreground">{contactCount.totalCount} accounts monitored</div>
            <div className="text-muted-foreground">{contactCount.verifiedCount} delegates configured</div>
          </div>
        </div>
      </div>
    </div>
  )
}
