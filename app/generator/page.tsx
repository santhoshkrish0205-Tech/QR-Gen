'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import { useQr } from '@/lib/qr-context';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { createQrCode } from '@/app/actions/qr';
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
  CreditCard,
  MessageSquare,
  MapPin,
  UserSquare,
  FileText,
  Star,
  Sparkles,
} from 'lucide-react';

const qrDestinations = [
  { id: 'Website', label: 'Website URL', icon: LinkIcon, group: 'Website' },
  { id: 'Wi-Fi', label: 'Wi-Fi Network', icon: Wifi, group: 'Wi-Fi' },
  { id: 'UPI', label: 'UPI Payment', icon: CreditCard, group: 'Other' },
  { id: 'WhatsApp', label: 'WhatsApp Chat', icon: MessageSquare, group: 'Other' },
  { id: 'GoogleReview', label: 'Google Review', icon: Star, group: 'Website' },
  { id: 'Location', label: 'Google Maps', icon: MapPin, group: 'Website' },
  { id: 'vCard', label: 'vCard Contact', icon: UserSquare, group: 'Other' },
  { id: 'PDFMenu', label: 'PDF Menu', icon: FileText, group: 'Menu' },
];

const presetColors = [
  { name: 'Classic Navy', hex: '#3525cd' },
  { name: 'Emerald', hex: '#006c49' },
  { name: 'Crimson', hex: '#ba1a1a' },
  { name: 'Amber Wood', hex: '#684000' },
  { name: 'Dark Slate', hex: '#1e293b' },
  { name: 'Magenta Glow', hex: '#d946ef' },
];

const presetBgColors = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Soft Gray', hex: '#f8fafc' },
  { name: 'Warm Cream', hex: '#fefbeb' },
  { name: 'Ice Blue', hex: '#f0f9ff' },
];

export default function GeneratorPage() {
  const router = useRouter();
  const { addQrCode, addActivity } = useQr();

  const [selectedDest, setSelectedDest] = useState(qrDestinations[0]);
  const [name, setName] = useState('');
  
  // Customization
  const [fgColor, setFgColor] = useState('#3525cd');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [selectedFrame, setSelectedFrame] = useState<'square' | 'circle' | 'dots'>('square');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [qrSize, setQrSize] = useState<number>(512);

  useEffect(() => {
    import('@/app/settings/actions').then((m) => {
      m.getUserSettings().then((s) => {
        setFgColor(s.defaultColor);
        setSelectedFrame(s.defaultFrame);
      });
    });
  }, []);

  // Form Fields
  const [url, setUrl] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  
  // UPI
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // WhatsApp
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Google Maps Location is now using the 'url' state

  // vCard
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');

  // PDF Menu / Document URL
  const [pdfUrl, setPdfUrl] = useState('');

  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);

  // Helper to compile the raw text data inside the QR code
  const getQrString = useCallback(() => {
    switch (selectedDest.id) {
      case 'Wi-Fi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'UPI':
        const upiParams = new URLSearchParams();
        if (upiId) upiParams.append('pa', upiId);
        if (payeeName) upiParams.append('pn', payeeName);
        if (amount) upiParams.append('am', amount);
        if (note) upiParams.append('tn', note);
        return `upi://pay?${upiParams.toString()}`;
      case 'WhatsApp':
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      case 'Location':
        return url || 'https://maps.app.goo.gl/';
      case 'vCard':
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${lastName};${firstName};;;`,
          `FN:${firstName} ${lastName}`,
          contactOrg ? `ORG:${contactOrg}` : '',
          contactPhone ? `TEL;TYPE=CELL:${contactPhone}` : '',
          contactEmail ? `EMAIL;TYPE=PREF,INTERNET:${contactEmail}` : '',
          'END:VCARD'
        ].filter(Boolean).join('\n');
      case 'PDFMenu':
        return pdfUrl || 'https://shopqr.in/demo-menu.pdf';
      default:
        return url || 'https://shopqr.in';
    }
  }, [
    selectedDest.id,
    url,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    upiId,
    payeeName,
    amount,
    note,
    phone,
    message,
    firstName,
    lastName,
    contactPhone,
    contactEmail,
    contactOrg,
    pdfUrl,
  ]);

  // Generate QR preview
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const data = getQrString();
        if (!data) {
          setQrDataUrl(null);
          return;
        }
        const dataUrl = await QRCode.toDataURL(data, {
          width: 512,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: errorLevel,
        });
        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl(null);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [fgColor, bgColor, errorLevel, getQrString]);

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

  const handleGenerateDownload = async () => {
    try {
      const data = getQrString();
      if (!data) {
        toast.error('Please fill in the required fields before generating.');
        return;
      }
      let dataUrl = await QRCode.toDataURL(data, {
        width: qrSize,
        margin: 3,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });

      if (logoFile) {
        dataUrl = await new Promise<string>((resolve) => {
          const canvas = document.createElement('canvas');
          canvas.width = qrSize;
          canvas.height = qrSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          const qrImg = new Image();
          qrImg.crossOrigin = 'anonymous';
          qrImg.onload = () => {
            ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.onload = () => {
              const logoSize = qrSize * 0.25;
              const xy = (qrSize - logoSize) / 2;
              
              // Draw background for logo to make it readable
              ctx.fillStyle = bgColor;
              ctx.beginPath();
              ctx.roundRect(xy - (qrSize * 0.02), xy - (qrSize * 0.02), logoSize + (qrSize * 0.04), logoSize + (qrSize * 0.04), qrSize * 0.03);
              ctx.fill();
              
              ctx.drawImage(logoImg, xy, xy, logoSize, logoSize);
              resolve(canvas.toDataURL('image/png'));
            };
            logoImg.onerror = () => resolve(dataUrl);
            logoImg.src = logoFile;
          };
          qrImg.onerror = () => resolve(dataUrl);
          qrImg.src = dataUrl;
        });
      }

      // Trigger download
      const link = document.createElement('a');
      const codeName = name || `QR_${selectedDest.id}_${Date.now()}`;
      link.download = `ShopQR_${codeName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      // Prepare Metadata
      const metadata = {
        wifiSsid, wifiPassword, wifiEncryption,
        upiId, payeeName, amount, note,
        phone, message,
        firstName, lastName, contactPhone, contactEmail, contactOrg,
        pdfUrl
      };

      // Save to database
      await createQrCode({
        name: codeName,
        type: selectedDest.group,
        destination_id: selectedDest.id,
        url: data,
        fg_color: fgColor,
        bg_color: bgColor,
        frame_style: selectedFrame,
        error_level: errorLevel,
        qr_size: qrSize,
        logo_url: logoFile || undefined,
        data_url: dataUrl,
        metadata
      });

      addActivity('QR Generated', `"${codeName}" was generated and downloaded.`, 'bg-primary');
      toast.success(`"${codeName}" saved to dashboard and downloaded!`);
    } catch (err) {
      toast.error('Failed to generate high-resolution QR code.');
    }
  };

  const handleCopyLink = async () => {
    const text = getQrString();
    if (!text) {
      toast.error('Nothing to copy.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('QR payload copied to clipboard!');
    } catch {
      toast.error('Failed to copy.');
    }
  };

  const handleShare = async () => {
    const text = getQrString();
    if (navigator.share) {
      try {
        await navigator.share({
          title: name || 'ShopQR Destination',
          text,
          url: text.startsWith('http') ? text : undefined,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleReset = () => {
    setSelectedDest(qrDestinations[0]);
    setFgColor(settings.defaultColor || '#3525cd');
    setBgColor('#ffffff');
    setSelectedFrame(settings.defaultFrame || 'square');
    setErrorLevel('H');
    setQrSize(512);
    setUrl('');
    setName('');
    setWifiSsid('');
    setWifiPassword('');
    setWifiEncryption('WPA');
    setUpiId('');
    setPayeeName('');
    setAmount('');
    setNote('');
    setPhone('');
    setMessage('');
    setLatitude('');
    setLongitude('');
    setAddress('');
    setFirstName('');
    setLastName('');
    setContactPhone('');
    setContactEmail('');
    setContactOrg('');
    setPdfUrl('');
    setLogoFile(null);
    setLogoName('');
    toast.info('Form cleared.');
  };

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-screen">
          
          {/* Left Panel: Configuration Form */}
          <div className="flex-1 p-6 md:p-10 max-w-4xl pt-20 lg:pt-8 space-y-6">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3525cd]/10 text-[#3525cd] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Pro Customizer
                </span>
              </div>
              <h2 className="font-jakarta text-3xl font-bold text-on-surface">Smart QR Code Generator</h2>
              <p className="text-on-surface-variant text-sm">Design tailored QR codes for menus, reviews, chats, wifi networks, and payments.</p>
            </header>

            {/* Step 1: Destination Type */}
            <section className="p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#3525cd]/15 flex items-center justify-center text-[#3525cd]">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <h3 className="font-jakarta text-lg font-bold">1. Select Destination Type</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {qrDestinations.map((dest) => {
                  const Icon = dest.icon;
                  const active = selectedDest.id === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => setSelectedDest(dest)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                        active
                          ? 'border-[#3525cd] bg-[#3525cd]/5 text-[#3525cd]'
                          : 'border-outline-variant hover:border-[#3525cd]/50 text-on-surface-variant'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <span className="text-xs font-bold">{dest.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Content Details */}
            <section className="p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/60 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#006c49]/15 flex items-center justify-center text-[#006c49]">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-jakarta text-lg font-bold">2. Enter Details</h3>
              </div>

              {/* Common Name */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">QR Code Name (Internal)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                  placeholder="e.g., Table 4 QR, Wifi Signboard, Payment Standee"
                />
              </div>

              {/* Dynamic input fields based on selected destination */}
              {selectedDest.id === 'Website' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Website URL</label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {selectedDest.id === 'Wi-Fi' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Wi-Fi SSID (Network Name)</label>
                    <input
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="e.g., MyBakery_Guest_5G"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Password</label>
                    <input
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="Network Password"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Security / Encryption</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                    >
                      <option value="WPA">WPA / WPA2 (Recommended)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedDest.id === 'UPI' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">UPI ID (e.g. payee@upi) *</label>
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="merchantname@upi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Payee Name *</label>
                    <input
                      value={payeeName}
                      onChange={(e) => setPayeeName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="e.g., Green Leaf Cafe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Amount (Optional)</label>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="e.g., 250"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Transaction Note</label>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="e.g., Table 4 Bill"
                    />
                  </div>
                </div>
              )}

              {selectedDest.id === 'WhatsApp' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">WhatsApp Phone Number (with Country Code) *</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="e.g., +919876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Pre-filled Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low resize-none"
                      placeholder="Hi! I want to order some fresh bread..."
                    />
                  </div>
                </div>
              )}

              {selectedDest.id === 'GoogleReview' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Google Review Link *</label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                    placeholder="https://g.page/r/.../review"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1">Get this link from your Google Business Profile dashboard.</p>
                </div>
              )}

              {selectedDest.id === 'Location' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Google Maps Link *</label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                    placeholder="https://maps.app.goo.gl/..."
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1">Paste the share link from Google Maps.</p>
                </div>
              )}

              {selectedDest.id === 'vCard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">First Name</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Last Name</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="+919876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Company / Organization</label>
                    <input
                      value={contactOrg}
                      onChange={(e) => setContactOrg(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                      placeholder="Green Leaf Cafe"
                    />
                  </div>
                </div>
              )}

              {selectedDest.id === 'PDFMenu' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">PDF Link / Menu File URL</label>
                  <input
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-sm bg-surface-container-low"
                    placeholder="https://example.com/menu.pdf"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1">Upload your PDF file to a cloud drive (e.g. Google Drive, Dropbox) and paste the link here.</p>
                </div>
              )}
            </section>

            {/* Step 3: Style & Brand Customizer */}
            <section className="p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/60 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-jakarta text-lg font-bold">3. Style & Brand QR Code</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foreground Color */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">QR Color (Foreground)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {presetColors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setFgColor(c.hex)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          fgColor === c.hex ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    <button
                      onClick={() => colorInputRef.current?.click()}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors relative overflow-hidden"
                    >
                      <Palette className="w-3.5 h-3.5 text-on-surface-variant" />
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Background Color</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {presetBgColors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setBgColor(c.hex)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          bgColor === c.hex ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    <button
                      onClick={() => bgColorInputRef.current?.click()}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors relative overflow-hidden"
                    >
                      <Palette className="w-3.5 h-3.5 text-on-surface-variant" />
                      <input
                        ref={bgColorInputRef}
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>

                {/* Size & Error Correction Level */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Error Correction Level</label>
                      <select
                        value={errorLevel}
                        onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-xs bg-surface-container-low"
                      >
                        <option value="L">Low (7% recovery) - Best for clean layouts</option>
                        <option value="M">Medium (15% recovery)</option>
                        <option value="Q">Quartile (25% recovery)</option>
                        <option value="H">High (30% recovery) - Best for logo overlay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Output Resolution (Size)</label>
                      <select
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none text-xs bg-surface-container-low"
                      >
                        <option value="256">256 × 256 px (Small, digital only)</option>
                        <option value="512">512 × 512 px (Medium, typical)</option>
                        <option value="1024">1024 × 1024 px (High-Res, print)</option>
                        <option value="2048">2048 × 2048 px (Ultra High-Res)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logo Upload Overlay */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Logo Overlay (Center Brand)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  {logoFile ? (
                    <div className="border border-primary/20 rounded-xl p-3 flex items-center gap-3 bg-primary/5">
                      <img src={logoFile} alt="Logo" className="w-10 h-10 rounded-lg object-contain border bg-white" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate">{logoName}</p>
                        <p className="text-[10px] text-on-surface-variant">Applied inside active preview</p>
                      </div>
                      <button onClick={() => { setLogoFile(null); setLogoName(''); }} className="p-1.5 text-on-surface-variant hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-outline-variant/65 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary/60 transition-colors cursor-pointer bg-surface-container-low/20"
                    >
                      <Upload className="w-6 h-6 text-on-surface-variant mb-1.5" />
                      <p className="text-xs font-bold text-on-surface-variant">Click to upload brand logo logo</p>
                      <p className="text-[9px] text-on-surface-variant/70 mt-0.5">JPEG, PNG or SVG. Square shapes work best.</p>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
              <button onClick={handleReset} className="px-5 py-2.5 font-medium text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Reset Form
              </button>
              <button
                onClick={handleGenerateDownload}
                className="bg-[#3525cd] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#3525cd]/25 hover:opacity-90 active:scale-95 transition-all text-sm"
              >
                <Download className="w-4 h-4" /> Save & Download QR
              </button>
            </div>
          </div>

          {/* Right Panel: Floating Live Preview */}
          <div className="w-full lg:w-[420px] lg:fixed lg:right-0 lg:top-0 lg:h-screen bg-surface-container-low border-l border-outline-variant/30 flex flex-col items-center justify-center p-8 z-30">
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="mb-6 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3525cd]/10 text-[#3525cd] rounded-full text-xs font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-pulse" /> Live Preview
                </span>
                <h4 className="font-jakarta text-xl font-bold text-on-surface">Test With Smartphone</h4>
              </div>

              {/* QR Preview Card */}
              <div className="relative group w-full">
                <div
                  className="absolute -inset-4 rounded-[40px] blur-2xl opacity-45 transition-all"
                  style={{ background: `linear-gradient(to top right, ${fgColor}25, transparent, #ffb95f20)` }}
                />
                <div className="relative bg-white p-6 rounded-[28px] shadow-xl border border-white flex flex-col items-center justify-center">
                  <div
                    className="aspect-square w-full rounded-2xl flex items-center justify-center overflow-hidden border relative bg-white"
                    style={{ backgroundColor: bgColor }}
                  >
                    {qrDataUrl ? (
                      <>
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          className="w-full h-full object-contain p-4 transition-all duration-300"
                        />
                        {/* Center Logo Overlay Simulation */}
                        {logoFile && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-md p-1.5 border flex items-center justify-center">
                              <img src={logoFile} alt="logo" className="w-full h-full object-contain rounded-md" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-xs text-on-surface-variant">Fill details to preview QR code</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions for Preview */}
              <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-outline-variant bg-white hover:bg-surface-container-low transition-all font-semibold text-xs text-on-surface"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Payload
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-outline-variant bg-white hover:bg-surface-container-low transition-all font-semibold text-xs text-on-surface"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              {/* Help tip info box */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-outline-variant/30 flex items-start gap-2.5 w-full">
                <Info className="w-4 h-4 text-[#3525cd] mt-0.5 shrink-0" />
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Generated code is stored in the <b>QR Database</b> automatically. This is a <b>Dynamic QR code</b>, allowing you to update its destination in the dashboard without re-printing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 w-full bg-surface shadow-sm h-16 flex items-center px-4 z-50 border-b border-outline-variant/30">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 mr-2">
          <Menu className="w-5 h-5 text-on-surface" />
        </button>
        <span className="font-jakarta text-lg font-bold text-[#3525cd]">ShopQR</span>
        <div className="ml-auto flex gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-container to-secondary-container" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/45" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-surface-container shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
