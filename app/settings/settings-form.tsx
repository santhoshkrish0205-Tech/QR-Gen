'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { User, Palette, BellRing, Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { UserSettings, saveUserSettings } from './actions';
import { createClient } from '@/utils/supabase/client';

const colorOptions = ['#3525cd', '#006c49', '#ba1a1a', '#684000', '#4f46e5'];

export default function SettingsForm({ initialSettings }: { initialSettings: UserSettings }) {
  const [storeName, setStoreName] = useState(initialSettings.storeName);
  const [email, setEmail] = useState(initialSettings.email);
  const [avatarUrl, setAvatarUrl] = useState(initialSettings.avatarUrl || '');
  const [defaultColor, setDefaultColor] = useState(initialSettings.defaultColor);
  const [defaultFrame, setDefaultFrame] = useState(initialSettings.defaultFrame);
  const [notifyScans, setNotifyScans] = useState(initialSettings.notifyScans);
  const [notifyMilestones, setNotifyMilestones] = useState(initialSettings.notifyMilestones);
  const [notifyWeekly, setNotifyWeekly] = useState(initialSettings.notifyWeekly);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    // Use auth uid to store in their own folder
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      setIsUploading(false);
      return;
    }

    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Error uploading image');
      console.error(uploadError);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    setIsUploading(false);
    toast.success('Avatar uploaded successfully! Don\'t forget to save.');
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveUserSettings({
      storeName,
      email,
      avatarUrl,
      defaultColor,
      defaultFrame,
      notifyScans,
      notifyMilestones,
      notifyWeekly,
    });
    
    setIsSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Settings saved successfully!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-jakarta text-xl font-semibold">Profile Settings</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-6 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
            <div className="relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Store Avatar" className="w-20 h-20 rounded-full object-cover shadow-sm border border-outline-variant/50" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                  {storeName ? storeName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
              </button>
            </div>
            
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold text-on-surface">Store Logo</h4>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Upload your store logo or profile picture. We recommend a square image of at least 256x256px.
              </p>
              <div className="pt-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors text-sm font-medium rounded-lg flex items-center gap-2 border border-outline-variant/50"
                >
                  <ImageIcon className="w-4 h-4 text-on-surface-variant" />
                  {isUploading ? 'Uploading...' : 'Choose Image'}
                </button>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-on-surface">Store Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="E.g. Green Leaf Cafe"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-on-surface">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white"
            />
          </div>
        </div>
        </div>
      </section>

      {/* Brand Defaults */}
      <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-shopsecondary">
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
          disabled={isSaving}
          className="bg-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
