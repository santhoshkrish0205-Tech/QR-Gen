'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import { useQr } from '@/lib/qr-context';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import {
  Link as LinkIcon,
  Wifi,
  BookOpen,
  MoreHorizontal,
  Palette,
  Upload,
  Download,
  Copy,
  Share2,
  Info,
  Menu,
  Bell,
  RotateCcw,
  X,
} from 'lucide-react';

const types = [
  { label: 'Website' as const, icon: LinkIcon },
  { label: 'Wi-Fi' as const, icon: Wifi },
  { label: 'Menu' as const, icon: BookOpen },
  { label: 'Other' as const, icon: MoreHorizontal },
];

const presetColors = [
  '#3525cd',
  '#006c49',
  '#ba1a1a',
  '#684000',
];

export default function GeneratorPage() {
  const router = useRouter();
  const { addQrCode, addActivity, settings } = useQr();

  const [selectedType, setSelectedType] = useState<'Website' | 'Wi-Fi' | 'Menu' | 'Other'>('Website');
  const [selectedColor, setSelectedColor] = useState(settings.defaultColor || '#3525cd');
  const [selectedFrame, setSelectedFrame] = useState<'square' | 'circle' | 'dots'>(settings.defaultFrame || 'square');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Compute the QR data string based on type
  const getQrString = useCallback(() => {
    if (selectedType === 'Wi-Fi') {
      return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
    }
    return url || 'https://shopqr.co';
  }, [selectedType, url, wifiSsid, wifiPassword, wifiEncryption]);

  // Generate QR preview (debounced)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const data = getQrString();
        const dataUrl = await QRCode.toDataURL(data, {
          width: 512,
          margin: 2,
          color: { dark: selectedColor, light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl(null);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedColor, getQrString]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(file);
    toast.success('Logo uploaded successfully');
  };

  // Generate and download
  const handleGenerateDownload = async () => {
    try {
      const data = getQrString();
      const dataUrl = await QRCode.toDataURL(data, {
        width: 1024,
        margin: 3,
        color: { dark: selectedColor, light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });

      // Download
      const link = document.createElement('a');
      const codeName = name || `QR_${selectedType}_${Date.now()}`;
      link.download = `ShopQR_${codeName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      // Save to context
      addQrCode({
        name: codeName,
        type: selectedType,
        url: selectedType === 'Wi-Fi' ? '' : url,
        status: 'Active',
        color: selectedColor,
        frameStyle: selectedFrame,
        logoUrl: logoFile || undefined,
        dataUrl,
        wifiSsid: selectedType === 'Wi-Fi' ? wifiSsid : undefined,
        wifiPassword: selectedType === 'Wi-Fi' ? wifiPassword : undefined,
        wifiEncryption: selectedType === 'Wi-Fi' ? wifiEncryption : undefined,
      });

      addActivity('QR Created', `"${codeName}" was generated and downloaded.`, 'bg-secondary');
      toast.success(`"${codeName}" generated and saved to dashboard!`);
    } catch {
      toast.error('Failed to generate QR code. Check your input.');
    }
  };

  // Copy link
  const handleCopyLink = async () => {
    const text = selectedType === 'Wi-Fi' ? getQrString() : url;
    if (!text) { toast.error('No URL to copy'); return; }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  // Share
  const handleShare = async () => {
    const text = selectedType === 'Wi-Fi' ? getQrString() : url;
    if (navigator.share) {
      try {
        await navigator.share({ title: name || 'ShopQR Code', text, url: text });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  // Reset
  const handleReset = () => {
    setSelectedType('Website');
    setSelectedColor(settings.defaultColor || '#3525cd');
    setSelectedFrame(settings.defaultFrame || 'square');
    setUrl('');
    setName('');
    setWifiSsid('');
    setWifiPassword('');
    setWifiEncryption('WPA');
    setLogoFile(null);
    setLogoName('');
    toast.info('Form reset to defaults');
  };

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left: Config Form */}
          <div className="flex-1 p-6 md:p-10 max-w-4xl pt-20 lg:pt-6">
            <header className="mb-10">
              <h2 className="font-jakarta text-3xl font-bold text-on-surface mb-2">QR Code Generator</h2>
              <p className="text-on-surface-variant">Design and customize high-resolution QR codes for your storefront.</p>
            </header>
            <div className="space-y-8">
              {/* Section 1: Type & Content */}
              <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-jakarta text-xl font-semibold">Select Type & Content</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {types.map((t) => {
                    const active = selectedType === t.label;
                    return (
                      <button
                        key={t.label}
                        onClick={() => setSelectedType(t.label)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                          active ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant hover:border-primary/50'
                        }`}
                      >
                        <t.icon className={`w-5 h-5 mb-1 ${active ? 'text-primary' : 'text-on-surface-variant'}`} />
                        <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-sm mb-2 text-on-surface">Code Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white"
                      placeholder="e.g., Summer Sale 2024"
                    />
                  </div>

                  {/* Conditional fields based on type */}
                  {selectedType === 'Wi-Fi' ? (
                    <>
                      <div>
                        <label className="block font-medium text-sm mb-2 text-on-surface">Wi-Fi SSID (Network Name)</label>
                        <input
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white"
                          placeholder="MyShop_Guest"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-sm mb-2 text-on-surface">Password</label>
                        <input
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white"
                          placeholder="Enter Wi-Fi password"
                          type="password"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-sm mb-2 text-on-surface">Encryption</label>
                        <div className="flex gap-2">
                          {['WPA', 'WEP', 'None'].map((enc) => (
                            <button
                              key={enc}
                              onClick={() => setWifiEncryption(enc)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                wifiEncryption === enc ? 'bg-primary text-white' : 'border border-outline-variant hover:border-primary text-on-surface-variant'
                              }`}
                            >
                              {enc}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block font-medium text-sm mb-2 text-on-surface">
                        {selectedType === 'Menu' ? 'Menu URL' : 'Target URL'}
                      </label>
                      <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface bg-white"
                        placeholder={selectedType === 'Menu' ? 'https://yourshop.com/menu.pdf' : 'https://yourshop.com'}
                        type="url"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Section 2: Style & Branding */}
              <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-shopsecondary">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="font-jakarta text-xl font-semibold">Style & Branding</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-medium text-sm mb-3 text-on-surface">Primary Color</label>
                    <div className="flex flex-wrap gap-3">
                      {presetColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`w-10 h-10 rounded-full shadow-md transition-all ${
                            selectedColor === c ? 'ring-2 ring-primary border-4 border-white' : 'border-2 border-white'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <button
                        onClick={() => colorInputRef.current?.click()}
                        className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-variant relative overflow-hidden"
                      >
                        <Palette className="w-4 h-4" />
                        <input
                          ref={colorInputRef}
                          type="color"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-sm mb-3 text-on-surface">Frame Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedFrame('square')}
                        className={`h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all ${selectedFrame === 'square' ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant hover:border-primary'}`}
                      >
                        <div className={`w-6 h-6 border-2 rounded-sm ${selectedFrame === 'square' ? 'border-primary' : 'border-on-surface-variant'}`} />
                      </button>
                      <button
                        onClick={() => setSelectedFrame('circle')}
                        className={`h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all ${selectedFrame === 'circle' ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant hover:border-primary'}`}
                      >
                        <div className={`w-6 h-6 border-2 rounded-full ${selectedFrame === 'circle' ? 'border-primary' : 'border-on-surface-variant'}`} />
                      </button>
                      <button
                        onClick={() => setSelectedFrame('dots')}
                        className={`h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all ${selectedFrame === 'dots' ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant hover:border-primary'}`}
                      >
                        <div className={`w-6 h-6 border-2 flex gap-1 p-0.5 ${selectedFrame === 'dots' ? 'border-primary' : 'border-on-surface-variant'}`}>
                          <div className={`w-1 h-1 rounded-full ${selectedFrame === 'dots' ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                          <div className={`w-1 h-1 rounded-full ${selectedFrame === 'dots' ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <label className="block font-medium text-sm mb-3 text-on-surface">Logo Overlay</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  {logoFile ? (
                    <div className="border-2 border-primary/30 rounded-xl p-4 flex items-center gap-4 bg-primary/5">
                      <img src={logoFile} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain border border-outline-variant" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">{logoName}</p>
                        <p className="text-[10px] text-on-surface-variant">Logo will appear at center of QR code</p>
                      </div>
                      <button onClick={() => { setLogoFile(null); setLogoName(''); }} className="p-2 text-on-surface-variant hover:text-error rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center group hover:border-primary transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors mb-2" />
                      <p className="font-medium text-sm text-on-surface-variant group-hover:text-primary">Click to upload SVG or PNG</p>
                      <p className="text-[10px] text-outline mt-1 uppercase tracking-widest">Recommended: Square, Transparent BG</p>
                    </button>
                  )}
                </div>
              </section>

              {/* Section 3: Actions */}
              <div className="flex items-center justify-between pt-6">
                <button onClick={handleReset} className="px-6 py-3 font-medium text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset to Default
                </button>
                <button
                  onClick={handleGenerateDownload}
                  className="bg-tertiary text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  <Download className="w-5 h-5" /> Generate and Download
                </button>
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="w-full lg:w-[450px] lg:fixed lg:right-0 lg:top-0 lg:h-screen bg-surface-container-high/50 border-l border-outline-variant/30 flex flex-col items-center justify-center p-8 z-30">
            <div className="w-full max-w-sm">
              <div className="mb-8 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-xs font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Live Preview
                </span>
                <h4 className="font-jakarta text-2xl font-semibold text-on-surface">Scan to Test</h4>
              </div>
              <div className="relative group">
                <div
                  className="absolute -inset-4 rounded-[40px] blur-2xl opacity-50"
                  style={{ background: `linear-gradient(to top right, ${selectedColor}33, transparent, #ffb95f33)` }}
                />
                <div className="relative bg-white p-8 rounded-[32px] shadow-2xl border border-white" style={{ boxShadow: `0 25px 50px -12px ${selectedColor}1a` }}>
                  <div
                    className="aspect-square w-full rounded-2xl flex items-center justify-center overflow-hidden border border-surface-container-high"
                    style={{ background: 'radial-gradient(circle at 50% 50%, #f0f3ff 0%, #ffffff 100%)' }}
                  >
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Code Preview" className="w-full h-full object-contain p-2 transition-all duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-sm text-on-surface-variant">Enter a URL to see your QR code</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-4">
                <button onClick={handleCopyLink} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant bg-white hover:bg-surface transition-all font-medium text-sm">
                  <Copy className="w-4 h-4" /> Copy Link
                </button>
                <button onClick={handleShare} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant bg-white hover:bg-surface transition-all font-medium text-sm">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
              <div className="mt-8 p-4 rounded-xl bg-surface-container flex items-start gap-3 border border-outline-variant/30">
                <Info className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Changes are saved automatically to your dashboard. This QR is <b>Dynamic</b>, meaning you can update the destination link anytime without re-printing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-surface shadow-sm h-16 flex items-center px-4 z-50 border-b border-outline-variant/30">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 mr-2">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-jakarta text-lg font-bold text-primary">ShopQR</span>
        <div className="ml-auto flex gap-3">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-container to-secondary-container" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-surface-container shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
