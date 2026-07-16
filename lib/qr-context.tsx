'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface QrCode {
  id: string;
  name: string;
  type: 'Website' | 'Wi-Fi' | 'Menu' | 'Other';
  url: string;
  status: 'Active' | 'Paused';
  scans: number;
  created: string;
  color: string;
  frameStyle: 'square' | 'circle' | 'dots';
  logoUrl?: string;
  dataUrl?: string;        // rendered QR image data URL
  wifiSsid?: string;
  wifiPassword?: string;
  wifiEncryption?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  color: string;
  read: boolean;
}

export interface UserSettings {
  storeName: string;
  email: string;
  defaultColor: string;
  defaultFrame: 'square' | 'circle' | 'dots';
  notifyScans: boolean;
  notifyMilestones: boolean;
  notifyWeekly: boolean;
}

interface QrContextType {
  qrCodes: QrCode[];
  activityLog: ActivityItem[];
  settings: UserSettings;
  unreadCount: number;
  addQrCode: (qr: Omit<QrCode, 'id' | 'scans' | 'created'>) => void;
  updateQrCode: (id: string, updates: Partial<QrCode>) => void;
  deleteQrCode: (id: string) => void;
  toggleStatus: (id: string) => void;
  addActivity: (title: string, desc: string, color?: string) => void;
  markAllRead: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetAllData: () => void;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const defaultSettings: UserSettings = {
  storeName: 'Local Bakery Store',
  email: 'owner@bakeryshop.com',
  defaultColor: '#3525cd',
  defaultFrame: 'square',
  notifyScans: true,
  notifyMilestones: true,
  notifyWeekly: false,
};

const seedQrCodes: QrCode[] = [
  {
    id: 'qr-1',
    name: 'Menu - Spring 2024',
    type: 'Menu',
    url: 'https://mybakery.com/menu-spring',
    status: 'Active',
    scans: 842,
    created: 'Mar 12, 2024',
    color: '#3525cd',
    frameStyle: 'square',
  },
  {
    id: 'qr-2',
    name: 'Store Wi-Fi',
    type: 'Wi-Fi',
    url: '',
    status: 'Active',
    scans: 1204,
    created: 'Jan 04, 2024',
    color: '#006c49',
    frameStyle: 'circle',
    wifiSsid: 'BakeryGuest_5G',
    wifiPassword: 'freshbread2024',
    wifiEncryption: 'WPA',
  },
  {
    id: 'qr-3',
    name: 'Holiday Promo',
    type: 'Website',
    url: 'https://mybakery.com/holiday-deals',
    status: 'Paused',
    scans: 3491,
    created: 'Nov 28, 2023',
    color: '#ba1a1a',
    frameStyle: 'dots',
  },
  {
    id: 'qr-4',
    name: 'Google Review',
    type: 'Website',
    url: 'https://g.page/mybakery/review',
    status: 'Active',
    scans: 567,
    created: 'Feb 14, 2024',
    color: '#3525cd',
    frameStyle: 'square',
  },
  {
    id: 'qr-5',
    name: 'Instagram Page',
    type: 'Website',
    url: 'https://instagram.com/mybakery',
    status: 'Active',
    scans: 1023,
    created: 'Dec 01, 2023',
    color: '#684000',
    frameStyle: 'circle',
  },
  {
    id: 'qr-6',
    name: 'Catering Menu',
    type: 'Menu',
    url: 'https://mybakery.com/catering',
    status: 'Active',
    scans: 312,
    created: 'Apr 02, 2024',
    color: '#006c49',
    frameStyle: 'square',
  },
  {
    id: 'qr-7',
    name: 'Valentine Special',
    type: 'Website',
    url: 'https://mybakery.com/valentines',
    status: 'Paused',
    scans: 2100,
    created: 'Feb 01, 2024',
    color: '#ba1a1a',
    frameStyle: 'dots',
  },
  {
    id: 'qr-8',
    name: 'Feedback Form',
    type: 'Other',
    url: 'https://forms.gle/mybakery-feedback',
    status: 'Active',
    scans: 445,
    created: 'Mar 20, 2024',
    color: '#3525cd',
    frameStyle: 'square',
  },
];

const seedActivity: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'New Scan Recorded',
    desc: 'Someone scanned "Menu - Spring 2024" via iPhone 14.',
    time: '2 mins ago',
    color: 'bg-secondary',
    read: false,
  },
  {
    id: 'act-2',
    title: 'Code Updated',
    desc: 'The destination for "Holiday Promo" was changed.',
    time: '3 hours ago',
    color: 'bg-primary',
    read: false,
  },
  {
    id: 'act-3',
    title: 'Report Generated',
    desc: 'Monthly analytics for February are now available.',
    time: '1 day ago',
    color: 'bg-tertiary-container',
    read: true,
  },
];

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

function saveToStorage(data: { qrCodes: QrCode[]; activityLog: ActivityItem[]; settings: UserSettings }) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked
  }
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function QrProvider({ children }: { children: ReactNode }) {
  const [qrCodes, setQrCodes] = useState<QrCode[]>(seedQrCodes);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(seedActivity);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.qrCodes) setQrCodes(stored.qrCodes);
      if (stored.activityLog) setActivityLog(stored.activityLog);
      if (stored.settings) setSettings({ ...defaultSettings, ...stored.settings });
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ qrCodes, activityLog, settings });
  }, [qrCodes, activityLog, settings, hydrated]);

  const addQrCode = useCallback((qr: Omit<QrCode, 'id' | 'scans' | 'created'>) => {
    const newCode: QrCode = {
      ...qr,
      id: `qr-${Date.now()}`,
      scans: 0,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setQrCodes((prev) => [newCode, ...prev]);
  }, []);

  const updateQrCode = useCallback((id: string, updates: Partial<QrCode>) => {
    setQrCodes((prev) => prev.map((qr) => (qr.id === id ? { ...qr, ...updates } : qr)));
  }, []);

  const deleteQrCode = useCallback((id: string) => {
    setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setQrCodes((prev) =>
      prev.map((qr) =>
        qr.id === id ? { ...qr, status: qr.status === 'Active' ? 'Paused' : 'Active' } : qr
      )
    );
  }, []);

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

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetAllData = useCallback(() => {
    setQrCodes(seedQrCodes);
    setActivityLog(seedActivity);
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  }, []);

  const unreadCount = activityLog.filter((a) => !a.read).length;

  return (
    <QrContext.Provider
      value={{
        qrCodes,
        activityLog,
        settings,
        unreadCount,
        addQrCode,
        updateQrCode,
        deleteQrCode,
        toggleStatus,
        addActivity,
        markAllRead,
        updateSettings,
        resetAllData,
      }}
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
