'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { useQr } from '@/lib/qr-context';
import { toast } from 'sonner';
import {
  QrCode as QrIcon,
  Users,
  Clock,
  TrendingUp,
  MoreVertical,
  Download,
  ChevronRight,
  ChevronDown,
  Printer,
  Share2,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const baseVelocityData = [
  { day: 'Mon', scans: 120 },
  { day: 'Tue', scans: 190 },
  { day: 'Wed', scans: 320 },
  { day: 'Thu', scans: 280 },
  { day: 'Fri', scans: 450 },
  { day: 'Sat', scans: 680 },
  { day: 'Sun', scans: 520 },
];

const deviceData = [
  { name: 'Mobile', value: 84, color: '#4f46e5' },
  { name: 'Desktop', value: 16, color: '#6cf8bb' },
];

const locationData = [
  { city: 'San Francisco', scans: 840 },
  { city: 'New York', scans: 720 },
  { city: 'London', scans: 590 },
  { city: 'Berlin', scans: 480 },
  { city: 'Tokyo', scans: 390 },
  { city: 'Sydney', scans: 310 },
  { city: 'Paris', scans: 280 },
];

const ranges = ['Last 7 Days', '30 Days', '90 Days'] as const;

export default function AnalyticsPage() {
  const { qrCodes } = useQr();
  const [range, setRange] = useState<typeof ranges[number]>('Last 7 Days');
  const [showMore, setShowMore] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [showCodeSelector, setShowCodeSelector] = useState(false);

  const codeSelectorRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (codeSelectorRef.current && !codeSelectorRef.current.contains(event.target as Node)) {
        setShowCodeSelector(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedCode = selectedCodeId ? qrCodes.find((c) => c.id === selectedCodeId) : null;
  const codeName = selectedCode?.name || 'Summer Sale Promo';

  // Scale data based on range
  const multiplier = range === '30 Days' ? 4.2 : range === '90 Days' ? 12.5 : 1;
  const velocityData = useMemo(() => {
    return baseVelocityData.map((d) => ({
      ...d,
      scans: Math.round(d.scans * multiplier * (0.8 + Math.random() * 0.4)),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const totalScans = velocityData.reduce((s, d) => s + d.scans, 0);
  const uniqueUsers = Math.round(totalScans * 0.69);
  const peakDay = velocityData.reduce((max, d) => (d.scans > max.scans ? d : max), velocityData[0]);

  // Export CSV
  const handleExportCSV = () => {
    const header = 'Day,Scans\n';
    const rows = velocityData.map((d) => `${d.day},${d.scans}`).join('\n');
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShopQR_Analytics_${codeName.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics data exported as CSV');
  };

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Analytics</span>
              <ChevronRight className="w-3 h-3" />
              <div className="relative" ref={codeSelectorRef}>
                <button
                  onClick={() => setShowCodeSelector(!showCodeSelector)}
                  className="text-xs font-medium uppercase tracking-wider text-primary flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  {codeName}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showCodeSelector && (
                  <div className="absolute top-6 left-0 w-56 bg-white border border-outline-variant rounded-xl shadow-2xl z-50 py-1 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedCodeId(null); setShowCodeSelector(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${!selectedCodeId ? 'text-primary font-semibold' : 'text-on-surface'}`}
                    >
                      Summer Sale Promo
                    </button>
                    {qrCodes.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCodeId(c.id); setShowCodeSelector(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors ${selectedCodeId === c.id ? 'text-primary font-semibold' : 'text-on-surface'}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <h2 className="font-jakarta text-3xl font-bold text-on-surface">QR Performance Insight</h2>
            <p className="text-on-surface-variant mt-1">
              Detailed traffic analysis for: <span className="font-semibold">shopqr.co/{codeName.toLowerCase().replace(/\s+/g, '-')}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-high p-1.5 rounded-xl border border-outline-variant">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  range === r ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-lowest'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* KPI Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-card tonal-elevation p-6 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary-container/10 rounded-lg">
                <QrIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-shopsecondary font-medium text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> 12.5%
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-medium text-sm">Total Scans</p>
              <h3 className="font-jakarta text-3xl font-bold text-on-surface mt-1">{totalScans.toLocaleString()}</h3>
            </div>
          </div>
          <div className="glass-card tonal-elevation p-6 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-secondary-container/20 rounded-lg">
                <Users className="w-6 h-6 text-shopsecondary" />
              </div>
              <span className="text-shopsecondary font-medium text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> 8.2%
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-medium text-sm">Unique Users</p>
              <h3 className="font-jakarta text-3xl font-bold text-on-surface mt-1">{uniqueUsers.toLocaleString()}</h3>
            </div>
          </div>
          <div className="glass-card tonal-elevation p-6 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-tertiary-fixed-dim/20 rounded-lg">
                <Clock className="w-6 h-6 text-tertiary" />
              </div>
              <div className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant uppercase">
                {peakDay.day}
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant font-medium text-sm">Peak Scan Day</p>
              <h3 className="font-jakarta text-3xl font-bold text-on-surface mt-1">{peakDay.scans.toLocaleString()}</h3>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-12 gap-6">
          {/* Line Chart */}
          <div className="col-span-12 lg:col-span-8 glass-card tonal-elevation p-6 rounded-xl min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-jakarta text-xl font-semibold text-on-surface">Scan Velocity</h4>
                <p className="text-on-surface-variant text-sm">Tracking interaction frequency — {range}</p>
              </div>
              <div className="relative" ref={moreRef}>
                <button onClick={() => setShowMore(!showMore)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showMore && (
                  <div className="absolute right-0 top-10 w-44 bg-white border border-outline-variant rounded-xl shadow-2xl z-50 py-1">
                    <button onClick={() => { handleExportCSV(); setShowMore(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <FileText className="w-4 h-4" /> Export as CSV
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/analytics`); toast.success('Report link copied!'); setShowMore(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <Share2 className="w-4 h-4" /> Share Report
                    </button>
                    <button onClick={() => { window.print(); setShowMore(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <Printer className="w-4 h-4" /> Print
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={velocityData}>
                  <defs>
                    <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#c7c4d8" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#464555', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#464555', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #c7c4d8', fontSize: 12 }}
                    cursor={{ stroke: '#4f46e5', strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#fff', stroke: '#4f46e5', strokeWidth: 3 }}
                    activeDot={{ r: 8 }}
                    fill="url(#velGrad)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="col-span-12 lg:col-span-4 glass-card tonal-elevation p-6 rounded-xl flex flex-col">
            <h4 className="font-jakarta text-xl font-semibold text-on-surface mb-6">Device Distribution</h4>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-[240px] mb-8">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={deviceData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={0}>
                      {deviceData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-3">
                {deviceData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-medium text-sm">{d.name}</span>
                    </div>
                    <span className="font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-span-12 lg:col-span-12 glass-card tonal-elevation p-6 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h4 className="font-jakarta text-xl font-semibold text-on-surface">Top Scan Locations</h4>
                <p className="text-on-surface-variant text-sm">City-level geographical data based on IP mapping</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-on-surface-variant uppercase">Export Data</span>
                <button onClick={handleExportCSV} className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#c7c4d8" vertical={false} />
                  <XAxis dataKey="city" tick={{ fill: '#464555', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#464555', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #c7c4d8', fontSize: 12 }}
                    cursor={{ fill: '#3525cd10' }}
                  />
                  <Bar dataKey="scans" fill="#3525cd" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
