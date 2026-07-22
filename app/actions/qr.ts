'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface QrCodeRecord {
  id: string;
  name: string;
  type: string;
  destination_id: string;
  url: string;
  status: string;
  scans: number;
  fg_color: string;
  bg_color: string;
  frame_style: string;
  error_level: string;
  qr_size: number;
  logo_url?: string;
  data_url?: string;
  metadata: any;
  created_at: string;
}

export async function getQrCodes(): Promise<QrCodeRecord[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching qr codes:', error);
    return [];
  }

  return data as QrCodeRecord[];
}

export async function createQrCode(qrData: Omit<QrCodeRecord, 'id' | 'created_at' | 'scans' | 'status'>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('qr_codes')
    .insert([
      { ...qrData, user_id: user.id, status: 'Active' }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating qr code:', error);
    throw new Error('Failed to create QR code');
  }

  revalidatePath('/dashboard');
  revalidatePath('/analytics');
  return data;
}

export async function updateQrCode(id: string, updates: Partial<QrCodeRecord>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('qr_codes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id); // Extra safety

  if (error) {
    console.error('Error updating qr code:', error);
    throw new Error('Failed to update QR code');
  }

  revalidatePath('/dashboard');
  revalidatePath('/analytics');
}

export async function deleteQrCode(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting qr code:', error);
    throw new Error('Failed to delete QR code');
  }

  revalidatePath('/dashboard');
  revalidatePath('/analytics');
}

export async function toggleQrCodeStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
  await updateQrCode(id, { status: newStatus });
  return newStatus;
}
