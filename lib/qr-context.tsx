'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

// Removed QrCode interface (migrated to Supabase)
export interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  color: string;
  read: boolean;
}




const seedActivity: ActivityItem[] = [];

// ── Context ────────────────────────────────────────────────────────────────────

const QrContext = createContext<QrContextType | null>(null);

const STORAGE_KEY = 'shopqr_data';

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: { activityLog: ActivityItem[] }) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked
  }
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function QrProvider({ children }: { children: ReactNode }) {
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(seedActivity);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.activityLog) setActivityLog(stored.activityLog);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ activityLog });
  }, [activityLog, hydrated]);

  const addActivity = useCallback((title: string, desc: string, color = 'bg-primary') => {
    const item: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      desc,
      time: 'Just now',
      color,
      read: false,
    };
    setActivityLog((prev) => [item, ...prev].slice(0, 50)); // keep last 50
  }, []);

  const markAllRead = useCallback(() => {
    setActivityLog((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);



  const unreadCount = activityLog.filter((a) => !a.read).length;

  return (
    <QrContext.Provider
      value={{
        activityLog,
        unreadCount,
        addActivity,
        markAllRead,
      } as any}
    >
      {children}
    </QrContext.Provider>
  );
}

export function useQr() {
  const ctx = useContext(QrContext);
  if (!ctx) throw new Error('useQr must be used within QrProvider');
  return ctx;
}
