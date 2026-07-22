import { getQrCodes } from '@/app/actions/qr';
import DashboardClient from './dashboard-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const qrCodes = await getQrCodes();
  
  return <DashboardClient initialQrCodes={qrCodes} />;
}
