'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { useQr } from '@/lib/qr-context';
import { toast } from 'sonner';
import {
  User,
  Palette,
  BellRing,
  AlertTriangle,
  Save,
  RotateCcw,
} from 'lucide-react';

const colorOptions = ['#3525cd', '#006c49', '#ba1a1a', '#684000', '#4f46e5'];

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useQr();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [email, setEmail] = useState(settings.email);
  const [defaultColor, setDefaultColor] = useState(settings.defaultColor);
  const [defaultFrame, setDefaultFrame] = useState(settings.defaultFrame);
  const [notifyScans, setNotifyScans] = useState(settings.notifyScans);
  const [notifyMilestones, setNotifyMilestones] = useState(settings.notifyMilestones);
  const [notifyWeekly, setNotifyWeekly] = useState(settings.notifyWeekly);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    updateSettings({
      storeName,
      email,
      defaultColor,
      defaultFrame,
      notifyScans,
      notifyMilestones,
      notifyWeekly,
    });
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    resetAllData();
    toast.success('All data has been reset to defaults');
    setShowResetConfirm(false);
    // Reset local state
    setStoreName('Local Bakery Store');
    setEmail('owner@bakeryshop.com');
    setDefaultColor('#3525cd');
    setDefaultFrame('square');
    setNotifyScans(true);
    setNotifyMilestones(true);
    setNotifyWeekly(false);
  };

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        <div className="p-4 md:p-8 max-w-3xl flex-1">
          <header className="mb-10">
            <h2 className="font-jakarta text-3xl font-bold text-on-surface mb-2">Settings</h2>
            <p className="text-on-surface-variant">Manage your account preferences and brand defaults.</p>
          </header>

          <div className="space-y-8">
            {/* Profile Settings */}
            <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-jakarta text-xl font-semibold">Profile Settings</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {storeName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-on-surface">Store Avatar</p>
                    <p className="text-xs text-on-surface-variant">Automatically generated from your store name</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-on-surface">Store Name</label>
                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-on-surface">Email Address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Brand Defaults */}
            <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-jakarta text-xl font-semibold">Brand Defaults</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">These defaults will be pre-selected when creating new QR codes.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-3 text-on-surface">Default QR Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setDefaultColor(c)}
                        className={`w-10 h-10 rounded-full shadow-md transition-all ${
                          defaultColor === c ? 'ring-2 ring-primary border-4 border-white' : 'border-2 border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-on-surface">Default Frame Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['square', 'circle', 'dots'] as const).map((frame) => (
                      <button
                        key={frame}
                        onClick={() => setDefaultFrame(frame)}
                        className={`h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          defaultFrame === frame ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant hover:border-primary'
                        }`}
                      >
                        {frame === 'square' && <div className={`w-6 h-6 border-2 rounded-sm ${defaultFrame === frame ? 'border-primary' : 'border-on-surface-variant'}`} />}
                        {frame === 'circle' && <div className={`w-6 h-6 border-2 rounded-full ${defaultFrame === frame ? 'border-primary' : 'border-on-surface-variant'}`} />}
                        {frame === 'dots' && (
                          <div className={`w-6 h-6 border-2 flex gap-1 p-0.5 ${defaultFrame === frame ? 'border-primary' : 'border-on-surface-variant'}`}>
                            <div className={`w-1 h-1 rounded-full ${defaultFrame === frame ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                            <div className={`w-1 h-1 rounded-full ${defaultFrame === frame ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary">
                  <BellRing className="w-5 h-5" />
                </div>
                <h3 className="font-jakarta text-xl font-semibold">Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'New Scan Alerts', desc: 'Get notified when someone scans your QR code', value: notifyScans, set: setNotifyScans },
                  { label: 'Milestone Alerts', desc: 'Notifications for scan milestones (100, 500, 1000...)', value: notifyMilestones, set: setNotifyMilestones },
                  { label: 'Weekly Report', desc: 'Receive a weekly email summary of scan analytics', value: notifyWeekly, set: setNotifyWeekly },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${item.value ? 'bg-primary' : 'bg-outline-variant'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${item.value ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                onClick={handleSave}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>

            {/* Danger Zone */}
            <section className="p-6 bg-error/5 rounded-xl border border-error/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-jakarta text-xl font-semibold text-error">Danger Zone</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                This will permanently reset all your QR codes, analytics, and settings back to the demo defaults. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-6 py-3 border-2 border-error text-error font-semibold rounded-xl hover:bg-error hover:text-white transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Data
              </button>
            </section>
          </div>
        </div>

        <Footer />
      </main>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowResetConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="font-jakarta text-xl font-bold text-on-surface">Reset All Data?</h3>
                <p className="text-sm text-on-surface-variant">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant">
              All your QR codes, activity history, and settings will be replaced with default demo data.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
                Cancel
              </button>
              <button onClick={handleReset} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-error text-white hover:opacity-90 transition-opacity">
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
