import { getQrCodes } from '@/app/actions/qr';
import AnalyticsClient from './analytics-client';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const qrCodes = await getQrCodes();
  
  return <AnalyticsClient initialQrCodes={qrCodes} />;
}
