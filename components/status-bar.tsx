"use client"

import { useAuth } from "@/contexts/auth-context";
import { getDelegateContactsCountsByDelegate, getDelegatesByUser, withBrowserClient } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function StatusBar() {
    const { user, profiles } = useAuth();
    const supabase = createClient();
    const [contactCount, setContactCount] = useState({
        totalCount: 0,
        verifiedCount: 0,
    });
    const [currentCheck, setCurrentCheck] = useState(null);
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
          return;
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

const loadWellnessCheck = async () => {
  try {

    const { data, error } = await supabase
      .from("wellness_checks")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

      setCurrentCheck(data)

    if (error) {
      console.log("[v0] Supabase error:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, created_at: data?.created_at || null }
  } catch (err) {
    console.log("[v0] loadWellnessCheck error:", err)
    return { success: false, error: "Failed to load latest wellness check" }
  }
}


  // Load delegates on mount and when user changes
  useEffect(() => {
    loadDelegates();
    loadWellnessCheck();
  }, [loadDelegates]);


  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Status: {profiles?.is_active ? "Active" : "Inactive"}</span>
            </div>
            {/* <div className="text-muted-foreground">Last wellness check: {dayjs(currentCheck?.created_at).fromNow()}</div> */}
            <div className="text-muted-foreground">Last wellness check: {dayjs("2025-12-05T03:25:27.562517+00:00").fromNow()}</div>
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
