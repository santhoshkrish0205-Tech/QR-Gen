'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import { useMenu } from '@/lib/menu-context';
import { useQr } from '@/lib/qr-context';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import {
  ChevronRight, Rocket, Download, ExternalLink, Copy, Check,
  Globe, QrCode as QrIcon, Share2,
} from 'lucide-react';

export default function PublishPage() {
  const { restaurant, categories, menuItems, publishMenu, updateRestaurant } = useMenu();
  const { addQrCode, addActivity } = useQr();

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(restaurant.published);

  const menuUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://shopqr.in'}/menu/${restaurant.slug}`;

  // Generate QR whenever URL changes
  useEffect(() => {
    QRCode.toDataURL(menuUrl, {
      width: 512, margin: 2,
      color: { dark: '#3525cd', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {});
  }, [menuUrl]);

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1200));
    publishMenu();
    setPublished(true);
    // Also register as a QR code in the existing system
    addQrCode({ name: `${restaurant.name} Menu`, type: 'Menu', url: menuUrl, status: 'Active', color: '#3525cd', frameStyle: 'square' });
    addActivity('Menu Published', `"${restaurant.name}" menu is now live at /menu/${restaurant.slug}`, 'bg-primary');
    toast.success('🎉 Menu is live!', { description: `Customers can scan your QR to see the menu.` });
    setPublishing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success('URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `ShopQR_${restaurant.name.replace(/\s+/g, '_')}_Menu.png`;
    a.click();
    toast.success('QR code downloaded!');
    updateRestaurant({ totalScans: restaurant.totalScans + 1 });
  };

  const totalItems = menuItems.filter((m) => m.isAvailable).length;

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        <header className="h-16 px-8 flex items-center justify-between bg-surface shadow-sm sticky top-0 z-30 border-b border-outline-variant">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/menu-builder" className="hover:text-[#3525cd] transition-colors">Menu Builder</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-on-surface font-semibold">Publish & QR</span>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3525cd]/10 text-[#3525cd] text-sm font-semibold mb-4">
                <Rocket className="w-4 h-4" /> Final Step
              </div>
              <h1 className="font-jakarta text-4xl font-bold text-on-surface mb-3">
                {published ? '🎉 Your menu is Live!' : 'Publish Your Menu'}
              </h1>
              <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
                {published
                  ? 'Your customers can now scan the QR code to see your menu instantly.'
                  : 'One click to go live. Your customers will see your menu instantly when they scan the QR.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Menu summary + URL */}
              <div className="space-y-5">
                {/* Menu summary */}
                <div className="bg-white rounded-2xl border border-outline-variant p-6">
                  <h3 className="font-jakarta font-bold text-on-surface mb-4">📋 Menu Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/50">
                      <span className="text-sm text-on-surface-variant">Restaurant</span>
                      <span className="font-semibold text-sm text-on-surface">{restaurant.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/50">
                      <span className="text-sm text-on-surface-variant">Categories</span>
                      <span className="font-semibold text-sm text-on-surface">{categories.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/50">
                      <span className="text-sm text-on-surface-variant">Menu Items (available)</span>
                      <span className="font-semibold text-sm text-on-surface">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-outline-variant/50">
                      <span className="text-sm text-on-surface-variant">Status</span>
                      <span className={`font-semibold text-sm px-2 py-0.5 rounded-full ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {restaurant.isOpen ? '● Open' : '● Closed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-on-surface-variant">Template</span>
                      <span className="font-semibold text-sm text-on-surface capitalize">{restaurant.themeId}</span>
                    </div>
                  </div>
                </div>

                {/* URL customizer */}
                <div className="bg-white rounded-2xl border border-outline-variant p-6">
                  <h3 className="font-jakarta font-bold text-on-surface mb-1">🔗 Menu URL</h3>
                  <p className="text-xs text-on-surface-variant mb-4">This is the link embedded in your QR code. Customize the slug.</p>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant mb-3">
                    <Globe className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                    <span className="text-sm text-on-surface-variant">shopqr.in/menu/</span>
                    <input
                      value={restaurant.slug}
                      onChange={(e) => updateRestaurant({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="flex-1 bg-transparent outline-none text-sm font-bold text-[#3525cd]"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Full URL'}
                  </button>
                </div>

                {/* Publish button */}
                {!published ? (
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full py-4 bg-gradient-to-r from-[#3525cd] to-[#6c63ff] text-white rounded-2xl text-base font-bold hover:opacity-90 transition-opacity shadow-xl shadow-[#3525cd]/30 flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {publishing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        Publish Menu & Generate QR
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href={`/menu/${restaurant.slug}`}
                      target="_blank"
                      className="w-full py-3.5 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> View Live Menu
                    </Link>
                    <button
                      onClick={handlePublish}
                      className="w-full py-3.5 border-2 border-[#3525cd] text-[#3525cd] rounded-2xl text-sm font-bold hover:bg-[#3525cd]/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Rocket className="w-4 h-4" /> Re-publish Updates
                    </button>
                  </div>
                )}
              </div>

              {/* Right: QR Code */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-outline-variant p-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-sm font-semibold text-on-surface mb-5">
                    <QrIcon className="w-4 h-4 text-[#3525cd]" /> Your Menu QR Code
                  </div>
                  {/* QR with branded border */}
                  <div className="p-4 rounded-2xl bg-white shadow-lg border border-outline-variant/50 mb-4">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Menu QR Code" className="w-56 h-56" />
                    ) : (
                      <div className="w-56 h-56 bg-surface-container-low rounded-xl animate-pulse flex items-center justify-center">
                        <QrIcon className="w-12 h-12 text-on-surface-variant/40" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant text-center mb-1">Scan to open:</p>
                  <p className="text-xs font-bold text-[#3525cd] text-center mb-5 break-all">{menuUrl}</p>

                  <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-[#3525cd] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" /> Download QR Code (PNG)
                  </button>
                  <p className="text-[11px] text-on-surface-variant mt-2 text-center">High-res 512×512px, perfect for print</p>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-[#3525cd] to-[#6c63ff] rounded-2xl p-5 text-white">
                  <h3 className="font-jakarta font-bold mb-3">💡 Pro Tips</h3>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li className="flex gap-2"><span className="flex-shrink-0">✅</span> Print the QR on table tents, menu boards, or at the entrance</li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✅</span> Update prices anytime — the QR code never changes</li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✅</span> Mark items unavailable without deleting them</li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✅</span> Add your WhatsApp number for direct orders</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
