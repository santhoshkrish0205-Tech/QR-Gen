'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface UserSettings {
  storeName: string;
  email: string;
  avatarUrl?: string;
  defaultColor: string;
  defaultFrame: 'square' | 'circle' | 'dots';
  notifyScans: boolean;
  notifyMilestones: boolean;
  notifyWeekly: boolean;
}

const defaultSettings: UserSettings = {
  storeName: '',
  email: '',
  avatarUrl: '',
  defaultColor: '#3525cd',
  defaultFrame: 'square',
  notifyScans: true,
  notifyMilestones: true,
  notifyWeekly: false,
};

export async function getUserSettings(): Promise<UserSettings> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return defaultSettings;
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    // If no settings exist yet, return defaults
    return {
      ...defaultSettings,
      email: user.email || '',
    };
  }

  return {
    storeName: data.store_name || '',
    email: data.email || user.email || '',
    avatarUrl: data.avatar_url || '',
    defaultColor: data.default_color || '#3525cd',
    defaultFrame: data.default_frame || 'square',
    notifyScans: data.notify_scans ?? true,
    notifyMilestones: data.notify_milestones ?? true,
    notifyWeekly: data.notify_weekly ?? false,
  };
}

export async function saveUserSettings(settings: UserSettings) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      id: user.id,
      store_name: settings.storeName,
      email: settings.email,
      avatar_url: settings.avatarUrl,
      default_color: settings.defaultColor,
      default_frame: settings.defaultFrame,
      notify_scans: settings.notifyScans,
      notify_milestones: settings.notifyMilestones,
      notify_weekly: settings.notifyWeekly,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving settings:', error);
    return { error: 'Failed to save settings' };
  }

  revalidatePath('/settings');
  return { success: true };
}
