'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { useQr } from '@/lib/qr-context';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { deleteQrCode, toggleQrCodeStatus, updateQrCode, QrCodeRecord } from '@/app/actions/qr';
import {
  QrCode,
  BarChart2,
  Zap,
  Filter,
  Plus,
  Download,
  Edit,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sparkles,
  X,
  Trash2,
  Settings,
  LogOut,
  User,
  Check,
  UtensilsCrossed,
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function DashboardClient({ initialQrCodes }: { initialQrCodes: QrCodeRecord[] }) {
  const { activityLog, unreadCount, markAllRead, addActivity } = useQr();
  
  // Local state for QR codes so we can optimistic update
  const [qrCodes, setQrCodes] = useState<QrCodeRecord[]>(initialQrCodes);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Paused'>('All');
  const [filterType, setFilterType] = useState<'All' | 'Website' | 'Wi-Fi' | 'Menu' | 'Other'>('All');
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Edit modal state
  const [editingCode, setEditingCode] = useState<QrCodeRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Filtered + paginated data
  const filtered = useMemo(() => {
    return qrCodes.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchType = filterType === 'All' || c.type === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [qrCodes, search, filterStatus, filterType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (status: typeof filterStatus, type: typeof filterType) => {
    setFilterStatus(status);
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleDownload = async (code: QrCodeRecord) => {
    try {
      let qrUrl = code.url || 'https://shopqr.co';
      
      // If it's wifi, reconstruct the payload from metadata
      if (code.destination_id === 'Wi-Fi' && code.metadata) {
        qrUrl = `WIFI:T:${code.metadata.wifiEncryption || 'WPA'};S:${code.metadata.wifiSsid || ''};P:${code.metadata.wifiPassword || ''};;`;
      }

      const qrWidth = code.qr_size || 1024;
      const errorLevel = (code.error_level as 'L'|'M'|'Q'|'H') || 'H';

      let dataUrl = await QRCode.toDataURL(qrUrl, {
        width: qrWidth,
        margin: 2,
        color: { dark: code.fg_color || '#3525cd', light: code.bg_color || '#ffffff' },
        errorCorrectionLevel: errorLevel,
      });

      if (code.logo_url) {
        dataUrl = await new Promise<string>((resolve) => {
          const canvas = document.createElement('canvas');
          canvas.width = qrWidth;
          canvas.height = qrWidth;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          const qrImg = new Image();
          qrImg.crossOrigin = 'anonymous';
          qrImg.onload = () => {
            ctx.drawImage(qrImg, 0, 0, qrWidth, qrWidth);
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.onload = () => {
              const logoSize = qrWidth * 0.25;
              const xy = (qrWidth - logoSize) / 2;
              
              ctx.fillStyle = code.bg_color || '#ffffff';
              ctx.beginPath();
              ctx.roundRect(xy - (qrWidth * 0.02), xy - (qrWidth * 0.02), logoSize + (qrWidth * 0.04), logoSize + (qrWidth * 0.04), qrWidth * 0.03);
              ctx.fill();
              
              ctx.drawImage(logoImg, xy, xy, logoSize, logoSize);
              resolve(canvas.toDataURL('image/png'));
            };
            logoImg.onerror = () => resolve(dataUrl);
            logoImg.src = code.logo_url!;
          };
          qrImg.onerror = () => resolve(dataUrl);
          qrImg.src = dataUrl;
        });
      }

      const link = document.createElement('a');
      link.download = `ShopQR_${code.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      toast.success(`Downloaded "${code.name}" QR code`);
      addActivity('QR Downloaded', `"${code.name}" was downloaded as PNG.`, 'bg-primary');
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  const openEdit = (code: QrCodeRecord) => {
    setEditingCode(code);
    setEditName(code.name);
    setEditUrl(code.url);
  };

  const saveEdit = async () => {
    if (!editingCode) return;
    try {
      await updateQrCode(editingCode.id, { name: editName, url: editUrl });
      
      // Optimistic update
      setQrCodes(qrCodes.map(q => q.id === editingCode.id ? { ...q, name: editName, url: editUrl } : q));
      
      addActivity('Code Updated', `"${editName}" details were updated.`, 'bg-primary');
      toast.success(`Updated "${editName}"`);
      setEditingCode(null);
    } catch (e) {
      toast.error('Failed to update QR Code');
    }
  };

  const handleDelete = async (code: QrCodeRecord) => {
    try {
      await deleteQrCode(code.id);
      setQrCodes(qrCodes.filter(q => q.id !== code.id));
      toast.success(`Deleted "${code.name}"`);
      addActivity('Code Deleted', `"${code.name}" was removed.`, 'bg-error');
    } catch (e) {
      toast.error('Failed to delete QR Code');
    }
  };

  const handleToggleStatus = async (code: QrCodeRecord) => {
    try {
      const newStatus = await toggleQrCodeStatus(code.id, code.status);
      setQrCodes(qrCodes.map(q => q.id === code.id ? { ...q, status: newStatus } : q));
      toast.info(`${code.name} ${newStatus === 'Active' ? 'activated' : 'paused'}`);
    } catch (e) {
      toast.error('Failed to toggle status');
    }
  };

  // Stats computed from state
  const totalCodes = qrCodes.length;
  const totalScans = qrCodes.reduce((sum, c) => sum + c.scans, 0);
  const todayScans = Math.floor(totalScans * 0.11); // simulated ~11% today

  const stats = [
    { label: 'Total QR Codes', value: totalCodes.toString(), trend: `${qrCodes.filter(c => c.status === 'Active').length} active`, icon: QrCode, color: 'primary' },
    { label: 'Monthly Scans', value: totalScans.toLocaleString(), trend: '+5.4% vs last mo.', icon: BarChart2, color: 'shopsecondary' },
    { label: "Today's Scans", value: todayScans.toLocaleString(), trend: '-2% vs yesterday', icon: Zap, color: 'tertiary', negative: true },
  ];

  const latestActivity = activityLog[0];

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-surface shadow-sm sticky top-0 z-30">
          <h2 className="font-jakarta text-2xl font-semibold text-on-surface">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64 bg-surface-container-low text-on-surface"
                placeholder="Search codes..."
              />
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotif(!showNotif); setShowProfile(false); if (!showNotif) markAllRead(); }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant transition-colors relative"
              >
                <Bell className="w-5 h-5 text-on-surface-variant" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border border-white" />}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-outline-variant rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-outline-variant flex items-center justify-between">
                    <h4 className="font-jakarta font-semibold text-sm">Notifications</h4>
                    <button onClick={() => setShowNotif(false)} className="text-on-surface-variant hover:text-primary"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant/40">
                    {activityLog.slice(0, 8).map((a) => (
                      <div key={a.id} className="p-3 hover:bg-surface-container-low transition-colors">
                        <p className="text-xs font-semibold text-on-surface">{a.title}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{a.desc}</p>
                        <p className="text-[10px] text-outline mt-1">{a.time}</p>
                      </div>
                    ))}
                    {activityLog.length === 0 && <p className="p-4 text-sm text-on-surface-variant text-center">No notifications</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }} className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-gradient-to-br from-primary-container to-secondary-container" />
              {showProfile && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  <Link href="/settings" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link href="/settings" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <hr className="border-outline-variant/40 my-1" />
                  <Link href="/" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-surface-container-low transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 flex-1">
          {/* Summary Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(79,70,229,0.08)] border border-transparent hover:border-primary transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      s.color === 'primary'
                        ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                        : s.color === 'shopsecondary'
                        ? 'bg-shopsecondary/10 text-shopsecondary group-hover:bg-shopsecondary group-hover:text-white'
                        : 'bg-tertiary-container/10 text-tertiary-container group-hover:bg-tertiary-container group-hover:text-white'
                    }`}
                  >
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-medium ${s.negative ? 'text-error' : 'text-shopsecondary'}`}>{s.trend}</span>
                </div>
                <h3 className="text-xs text-on-surface-variant">{s.label}</h3>
                <p className="font-jakarta text-3xl font-bold text-on-surface">{s.value}</p>
              </div>
            ))}
            {/* Live Status Card */}
            <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(79,70,229,0.08)] border border-transparent hover:border-primary transition-all overflow-hidden relative">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xs text-on-surface-variant mb-2">Live Status</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shopsecondary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-shopsecondary" />
                    </span>
                    <p className="text-sm font-medium text-shopsecondary">Active Campaign</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mt-2">
                  {latestActivity ? `${latestActivity.desc}` : 'No recent activity'}
                </p>
              </div>
            </div>
          </section>

          {/* Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* QR Codes Table */}
            <section className="lg:col-span-8 bg-white rounded-xl shadow-[0px_4px_12px_rgba(79,70,229,0.08)] overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="font-jakarta text-xl font-semibold text-on-surface">My QR Codes</h2>
                <div className="flex items-center gap-2">
                  {/* Filter Dropdown */}
                  <div className="relative" ref={filterRef}>
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className={`px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors ${(filterStatus !== 'All' || filterType !== 'All') ? 'border-primary text-primary' : ''}`}
                    >
                      <Filter className="w-4 h-4" /> Filter
                      {(filterStatus !== 'All' || filterType !== 'All') && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                    {showFilter && (
                      <div className="absolute right-0 top-11 w-56 bg-white border border-outline-variant rounded-xl shadow-2xl z-50 p-4 space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Status</p>
                          {(['All', 'Active', 'Paused'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => { handleFilterChange(s, filterType); }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${filterStatus === s ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                            >
                              {s} {filterStatus === s && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Type</p>
                          {(['All', 'Website', 'Wi-Fi', 'Menu', 'Other'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => { handleFilterChange(filterStatus, t); }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${filterType === t ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                            >
                              {t} {filterType === t && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => { handleFilterChange('All', 'All'); setShowFilter(false); }} className="w-full text-xs text-center text-on-surface-variant hover:text-primary py-1">
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/generator"
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" /> New Code
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th className="px-6 py-4 font-medium text-sm text-on-surface-variant">Name & Type</th>
                      <th className="px-6 py-4 font-medium text-sm text-on-surface-variant">Status</th>
                      <th className="px-6 py-4 font-medium text-sm text-on-surface-variant">Scans</th>
                      <th className="px-6 py-4 font-medium text-sm text-on-surface-variant">Created</th>
                      <th className="px-6 py-4 font-medium text-sm text-on-surface-variant text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {paginated.map((qr) => (
                      <tr key={qr.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded border border-outline-variant flex items-center justify-center overflow-hidden" style={{ backgroundColor: `${qr.fg_color}10` }}>
                              <QrCode className="w-6 h-6" style={{ color: qr.fg_color }} />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-on-surface">{qr.name}</p>
                              <p className="text-xs text-on-surface-variant">{qr.destination_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(qr)}
                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                              qr.status === 'Active'
                                ? 'bg-shopsecondary/10 text-shopsecondary hover:bg-shopsecondary/20'
                                : 'bg-tertiary-container/10 text-tertiary-container hover:bg-tertiary-container/20'
                            }`}
                          >
                            {qr.status}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{qr.scans.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-on-surface-variant">{new Date(qr.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDownload(qr)} title="Download QR" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                              <Download className="w-4 h-4" />
                            </button>
                            <Link href="/analytics" title="View Analytics" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                              <BarChart2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => openEdit(qr)} title="Edit Code" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(qr)} title="Delete" className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginated.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-on-surface-variant">No QR codes found matching your criteria.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-outline-variant flex items-center justify-between">
                <p className="text-sm text-on-surface-variant">
                  Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} codes
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Right Column */}
            <section className="lg:col-span-4 space-y-6">
              {/* Quick Actions */}
              <div className="bg-primary p-6 rounded-xl text-white shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-jakarta text-xl font-semibold mb-4">Your Digital Menu</h3>
                  <p className="text-sm mb-6 opacity-90">
                    Edit your restaurant menu. Changes go live instantly — no reprints needed.
                  </p>
                  <Link
                    href="/menu-builder"
                    className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors mb-2"
                  >
                    <UtensilsCrossed className="w-4 h-4" /> Open Menu Builder
                  </Link>
                  <Link
                    href="/generator"
                    className="w-full py-2 border border-white/30 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> QR Generator
                  </Link>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(79,70,229,0.08)]">
                <h3 className="font-jakarta text-xl font-semibold text-on-surface mb-4">Recent Activity</h3>
                <div className="space-y-6">
                  {activityLog.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex gap-4">
                      <div className={`w-2 ${a.color} rounded-full`} />
                      <div>
                        <p className="font-medium text-sm text-on-surface">{a.title}</p>
                        <p className="text-sm text-on-surface-variant">{a.desc}</p>
                        <p className="text-xs text-outline mt-1">{a.time}</p>
                      </div>
                    </div>
                  ))}
                  {activityLog.length === 0 && <p className="text-sm text-on-surface-variant text-center py-4">No activity yet</p>}
                </div>
                <Link
                  href="/analytics"
                  className="w-full mt-6 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors block text-center"
                >
                  View All Activity
                </Link>
              </div>
            </section>
          </div>
        </div>

        <Footer />

        {/* FAB */}
        <Link
          href="/generator"
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all lg:hidden z-50"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </main>

      {/* Edit Modal */}
      {editingCode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingCode(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-jakarta text-xl font-bold text-on-surface">Edit QR Code</h3>
              <button onClick={() => setEditingCode(null)} className="text-on-surface-variant hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-on-surface">Name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-on-surface">Destination URL</label>
              <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white" placeholder="https://..." />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(editingCode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${editingCode.status === 'Active' ? 'border-tertiary-container text-tertiary-container hover:bg-tertiary-container/10' : 'border-shopsecondary text-shopsecondary hover:bg-shopsecondary/10'}`}
              >
                {editingCode.status === 'Active' ? 'Pause Code' : 'Activate Code'}
              </button>
              <button onClick={saveEdit} className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
