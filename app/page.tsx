'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  ArrowRight,
  UtensilsCrossed,
  Wifi,
  Star,
  IndianRupee,
  CheckCircle,
  XCircle,
  Globe,
  Share2,
  CreditCard,
  QrCode,
  Check,
  ChevronDown,
  Smartphone,
  Eye,
  Sliders,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('dining');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isStepsHovered, setIsStepsHovered] = useState(false);
  const [isTabsHovered, setIsTabsHovered] = useState(false);

  useEffect(() => {
    if (isStepsHovered) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isStepsHovered, activeStep]);

  useEffect(() => {
    if (isTabsHovered) return;
    const tabKeys = ['dining', 'retail', 'hotels'];
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabKeys.length;
        return tabKeys[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isTabsHovered, activeTab]);

  const steps = [
    {
      title: 'Select Destination',
      description: 'Choose from a variety of destinations: link to menus, Google reviews, or guest Wi-Fi networks.',
      icon: Smartphone,
      preview: (
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-3 w-full max-w-sm mx-auto shadow-inner text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Step 1 Preview</span>
          <h4 className="font-semibold text-sm">Select QR Destination Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Website Link', 'Wi-Fi Network', 'Digital Menu', 'Feedback Form'].map((t, idx) => (
              <div key={idx} className={`p-3 rounded-xl border text-[10px] font-medium flex items-center gap-1.5 cursor-pointer transition-all ${idx === 0 ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white border-outline-variant hover:bg-surface-variant text-on-surface'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-white' : 'bg-primary'}`} />
                {t}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Brand & Customize',
      description: 'Align the QR code with your brand colors, custom border designs, logos, and frames.',
      icon: Sliders,
      preview: (
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-3 w-full max-w-sm mx-auto shadow-inner text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Step 2 Preview</span>
          <h4 className="font-semibold text-sm">Customize Code Appearance</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant w-16 text-left">Primary:</span>
              <div className="flex gap-2">
                {['#3525cd', '#006c49', '#ba1a1a'].map((c, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border-2 ${i === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-white'} cursor-pointer`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant w-16 text-left">Frame:</span>
              <div className="px-3 py-1 bg-white border border-primary rounded-lg text-[10px] font-semibold text-primary">Minimal Frame</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant w-16 text-left">Logo:</span>
              <div className="w-5 h-5 bg-white border border-outline-variant rounded flex items-center justify-center text-[10px] font-bold">🎯</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Generate & Publish',
      description: 'Generate high-resolution PNG, SVG, or PDF formats to place on table stands, windows, or print material.',
      icon: Eye,
      preview: (
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-3 w-full max-w-sm mx-auto shadow-inner items-center text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Step 3 Preview</span>
          <h4 className="font-semibold text-sm">Download High-Res Assets</h4>
          <div className="w-20 h-20 bg-white border border-outline-variant p-2 rounded-xl flex items-center justify-center shadow-md">
            <QrCode className="w-12 h-12 text-primary" />
          </div>
          <div className="flex gap-2 w-full mt-2">
            <button className="flex-1 py-1 bg-primary text-white text-[10px] font-semibold rounded-lg shadow hover:opacity-90">PNG</button>
            <button className="flex-1 py-1 bg-white border border-outline-variant text-on-surface text-[10px] font-semibold rounded-lg hover:bg-surface-variant">SVG</button>
          </div>
        </div>
      ),
    },
    {
      title: 'Monitor Analytics',
      description: 'Track how many scans you get, what types of devices are scanning, and what times are the most popular.',
      icon: TrendingUp,
      preview: (
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-3 w-full max-w-sm mx-auto shadow-inner text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Step 4 Preview</span>
          <h4 className="font-semibold text-sm">Live Scan Insights</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded-xl border border-outline-variant">
              <span className="text-[9px] text-on-surface-variant">Total Scans</span>
              <p className="text-sm font-bold text-primary">2,842</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-outline-variant">
              <span className="text-[9px] text-on-surface-variant">Active Ratio</span>
              <p className="text-sm font-bold text-secondary">94%</p>
            </div>
          </div>
          <div className="h-10 bg-white border border-outline-variant rounded-xl flex items-end p-1 gap-1">
            {[20, 45, 30, 60, 40, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      ),
    },
  ];

  const solutions = {
    dining: {
      title: 'Cafes & Dining',
      tagline: 'Modernize ordering and menu management.',
      points: [
        'Update digital menus instantly without reprinting QR codes.',
        'Accept orders directly from guest tables using scan-to-order.',
        'Collect digital feedback and table-specific tips seamlessly.',
      ],
      color: 'bg-primary',
      accent: 'border-primary text-primary',
      bgLight: 'bg-primary/5',
      badge: 'Order & Dine',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg9IEUZzFiulLsdO19jkUUl_-znVqTDDmI4efKyVWs6-uMXx-tJTvjteOXESoj3XiUz4uy4p4VQmg594wy74xF26cx43ZY2hPNLHojkPhoO53G12mLkj0gZhOvWoidxDOlgRXIQmI7Oovk3kTjdnS5cfJi8jRj6tpg9IqUsXhBJ7luHtYpzTaJW_BaP37tN-L7nLBspZ_70TcFJ3PrM2HKpqv7PzrrWpAZOHWASSf8OiDqnCtEvqE',
    },
    retail: {
      title: 'Retail & Shops',
      tagline: 'Connect physical shoppers with your digital catalog.',
      points: [
        'Display digital spec sheets, styling guides, or sizes by the product shelf.',
        'Run paperless coupon campaigns scanned directly at point of sale.',
        'Request instant Google reviews from customers while at the store checkout.',
      ],
      color: 'bg-secondary',
      accent: 'border-secondary text-secondary',
      bgLight: 'bg-secondary/5',
      badge: 'Scan & Shop',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE8qeX8blEbfwFh5Mydq0xzRQr4wejtr8hZzxiTxAOq_cCx3JznzUEtu370z4CDee7JiOjMmP3rewz5KGZhI79IukT-fsKf7qG5J4UvqIWX2aGaDVZcfiJy2ttwQ78J4OhJNceDWY1zfFt2JQuAIHhk_FLVc1-W3bHYSVSAGDnrc8iNPGeB52XEJTebqNi47AkJjP8WUUoCGQj0oiAh58-h0ctvk4YrUjRcmbXDn3Oc5flHY1GrG8',
    },
    hotels: {
      title: 'Hotels & Stays',
      tagline: 'Deliver fluid hotel services straight to the room.',
      points: [
        'Scan QR on guest bedside table to access room service & housekeeping.',
        'Speed up reception workflows with seamless digital check-in/out.',
        'Link to guides for local sightseeing, maps, and restaurant reviews.',
      ],
      color: 'bg-tertiary-container',
      accent: 'border-tertiary text-tertiary',
      bgLight: 'bg-tertiary/5',
      badge: 'Bedside Utility',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5nCk2LNgQ23PIwl3F0h_Do4DpOKE-QiMMZ2LCH1wwoK6CQGY9Mz5eT7e_IL-Uecbi7QmSP8N1rWvshrLqfIArEqkOFf8CJ0jjXMKhMnSlEXM6NIVefsa0END4SQSReIghGkY5VxGsZax2Mlbk0Mdytf8jZA1SJHYFn262PXVEt5351Bg38tVSEOezf_d1_hdH5FolJ47AQFrIKPCEupv93RiL_uQ4Tp1nEm9HBsXUoJFkXHBVVTY',
    },
  };

  const faqs = [
    {
      q: 'What is a Dynamic QR code?',
      a: 'A Dynamic QR code has a short redirection URL, meaning you can change the final destination link (e.g. your PDF menu or website URL) anytime you want, without having to reprint the QR code itself. It also allows you to track comprehensive scan analytics.',
    },
    {
      q: 'Do customers need an app to scan?',
      a: 'No app is required! Customers can simply point their native iOS or Android camera app at the QR code, and a browser link will pop up instantly, ensuring maximum accessibility.',
    },
    {
      q: 'How does the UPI payment QR work?',
      a: 'The UPI payment QR utilizes the official UPI spec. When a customer scans it, their banking or payment app (like PhonePe, Google Pay, or Paytm) opens automatically with your payment details and amount pre-filled, making transactions instant and zero-fee.',
    },
    {
      q: 'Can I design the QR code to match my logo?',
      a: 'Absolutely! You can choose custom brand colors, custom frame sizes, background colors, and upload your high-resolution shop logo to sit right in the center of the QR code.',
    },
  ];

  return (
    <div className="min-h-screen bg-shopbg text-on-surface overflow-x-hidden">
      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fade-in-fill {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface shadow-sm backdrop-blur-md">
        <Link href="/" className="font-jakarta text-2xl font-bold text-primary hover:opacity-80 transition-opacity">ShopQR</Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors">
            Features
          </a>
          <a href="#solutions" className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors">
            Solutions
          </a>
          <a href="#pricing" className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden sm:block text-on-surface-variant font-medium text-sm hover:text-primary transition-colors px-4 py-2">
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="bg-primary text-white font-medium text-sm px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at top right, rgba(79,70,229,0.05), transparent), radial-gradient(circle at bottom left, rgba(255,185,95,0.05), transparent)',
            }}
          />
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center relative">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-container/10 text-primary font-medium text-sm uppercase tracking-wider">
                The All-in-One QR Suite
              </span>
              <h1 className="font-jakarta text-4xl md:text-6xl text-on-surface mb-6 leading-tight font-bold">
                Everything your customers need. <span className="text-primary">One QR platform.</span>
              </h1>
              <p className="text-lg text-on-surface-variant mb-10 max-w-xl">
                Empower your business with dynamic QR codes that drive sales, gather reviews, and simplify payments. Designed for local shops, built for global growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="bg-white border border-outline-variant text-on-surface font-semibold px-8 py-4 rounded-xl hover:bg-surface-container transition-all text-center">
                  View Demo
                </a>
              </div>
              <div className="mt-8 flex items-center gap-4 text-on-surface-variant">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-container to-secondary-container"
                    />
                  ))}
                </div>
                <p className="text-xs font-medium">Joined by 2,000+ local shop owners</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl" />
              <div className="relative glass-card p-4 rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE8qeX8blEbfwFh5Mydq0xzRQr4wejtr8hZzxiTxAOq_cCx3JznzUEtu370z4CDee7JiOjMmP3rewz5KGZhI79IukT-fsKf7qG5J4UvqIWX2aGaDVZcfiJy2ttwQ78J4OhJNceDWY1zfFt2JQuAIHhk_FLVc1-W3bHYSVSAGDnrc8iNPGeB52XEJTebqNi47AkJjP8WUUoCGQj0oiAh58-h0ctvk4YrUjRcmbXDn3Oc5flHY1GrG8"
                  alt="Customer scanning QR code"
                  className="w-full h-full object-cover rounded-[1.5rem]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-on-secondary-container" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-on-surface">Payment Success</p>
                      <p className="text-[10px] text-on-surface-variant">₹1,240 received via UPI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QR Types Grid */}
        <section className="py-24 bg-surface-container-lowest" id="features">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="font-jakarta text-3xl md:text-5xl text-on-surface mb-4 font-bold">
                One QR. Infinite Possibilities.
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Choose from our specialized QR types designed to handle every customer interaction seamlessly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-surface-container border border-outline-variant p-8 hover:shadow-lg transition-all">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <UtensilsCrossed className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-jakarta text-2xl text-on-surface mb-2 font-semibold">Digital Menu & Ordering</h3>
                    <p className="text-on-surface-variant max-w-sm">
                      Let customers browse your offerings and place orders directly from their phones. No apps required.
                    </p>
                  </div>
                  <div className="mt-12 flex justify-end">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg9IEUZzFiulLsdO19jkUUl_-znVqTDDmI4efKyVWs6-uMXx-tJTvjteOXESoj3XiUz4uy4p4VQmg594wy74xF26cx43ZY2hPNLHojkPhoO53G12mLkj0gZhOvWoidxDOlgRXIQmI7Oovk3kTjdnS5cfJi8jRj6tpg9IqUsXhBJ7luHtYpzTaJW_BaP37tN-L7nLBspZ_70TcFJ3PrM2HKpqv7PzrrWpAZOHWASSf8OiDqnCtEvqE"
                      alt="Digital tablet menu"
                      className="w-2/3 h-48 object-cover rounded-tl-2xl shadow-2xl group-hover:-translate-y-2 transition-transform"
                    />
                  </div>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="group bg-white border border-outline-variant p-8 rounded-3xl hover:border-primary transition-all flex flex-col justify-between h-full">
                <div>
                  <Wifi className="w-8 h-8 text-primary mb-4 animate-pulse" />
                  <h3 className="font-jakarta text-2xl text-on-surface mb-2 font-semibold">Join Wi-Fi</h3>
                  <p className="text-on-surface-variant text-sm">
                    Stop repeating your password. A simple scan connects your customers to your guest network instantly.
                  </p>
                </div>

                {/* Simulated Wi-Fi Network Settings Screen */}
                <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-outline-variant/40 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                    <span>Wi-Fi Settings</span>
                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">Auto-Join Active</span>
                  </div>
                  <div className="space-y-2">
                    {/* Active connecting network */}
                    <div className="p-3 rounded-xl bg-white border border-primary/30 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                          <Wifi className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-on-surface">ShopGuest_HighSpeed</p>
                          <p className="text-[9px] text-primary font-medium text-left">Connected • 75 Mbps</p>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    </div>


                  </div>
                </div>

                <div>
                  <div className="p-4 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shopsecondary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-shopsecondary" />
                      </div>
                      <span className="text-xs font-semibold text-shopsecondary">Free Guest Wi-Fi</span>
                    </div>
                    <span className="text-xs font-medium text-on-secondary-container bg-secondary-container px-2.5 py-0.5 rounded-full">Connected</span>
                  </div>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="group bg-white border border-outline-variant p-8 rounded-3xl hover:border-primary transition-all flex flex-col justify-between h-full text-left">
                <div>
                  <Star className="w-8 h-8 text-primary mb-4 fill-primary" />
                  <h3 className="font-jakarta text-2xl text-on-surface mb-2 font-semibold">Google Reviews</h3>
                  <p className="text-on-surface-variant text-sm">
                    Boost your SEO and visibility. Direct customers straight to your review page while they're still in your shop.
                  </p>
                </div>

                {/* Google score rating card */}
                <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-outline-variant/40 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="text-xs font-bold text-on-surface">Google Rating</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-primary">4.9</span>
                      <div className="flex text-tertiary-fixed-dim">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Floating simulated review bubbles */}
                  <div className="space-y-2.5">
                    <div className="p-3 bg-white rounded-xl border border-outline-variant/30 shadow-sm flex gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold shrink-0">
                        SK
                      </div>
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-on-surface">Santhosh K.</span>
                          <span className="text-[8px] text-on-surface-variant">Verified Buyer</span>
                        </div>
                        <p className="text-[10px] leading-snug text-on-surface-variant">
                          &quot;Ordering was super fast. Simple scan of the table QR, no waits!&quot;
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-tertiary-fixed-dim fill-tertiary-fixed-dim" />
                    ))}
                    <span className="text-xs font-bold text-on-surface ml-1">5.0 / 5.0</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">&quot;Loved the bakery products! Will visit again!&quot;</p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-surface-container-high border border-outline-variant p-8 hover:shadow-lg transition-all text-left">
                <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                  <div>
                    <IndianRupee className="w-8 h-8 text-on-surface mb-4" />
                    <h3 className="font-jakarta text-2xl text-on-surface mb-2 font-semibold">UPI & Global Payments</h3>
                    <p className="text-on-surface-variant">
                      Accept payments via PhonePe, Google Pay, or Credit Cards through one unified QR code.
                    </p>
                    <Link href="/generator" className="mt-6 text-primary font-medium text-sm flex items-center gap-2 group/btn">
                      Explore Payment Options <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="relative h-64 md:h-72 w-full overflow-hidden rounded-2xl shadow-lg border border-outline-variant/30">
                    <img
                      src="/images/payment_qr_standee.png"
                      alt="UPI tabletop payment standee"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-surface" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider">
                Simple Setup Flow
              </span>
              <h2 className="font-jakarta text-3xl md:text-5xl text-on-surface mt-4 mb-4 font-bold">
                Deploy in Four Easy Steps
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                No technical skills required. Configure, download, and start receiving scans in under 5 minutes.
              </p>
            </div>

            <div 
              onMouseEnter={() => setIsStepsHovered(true)}
              onMouseLeave={() => setIsStepsHovered(false)}
              className="grid lg:grid-cols-12 gap-12 items-center"
            >
              {/* Steps List */}
              <div className="lg:col-span-7 space-y-4">
                {steps.map((step, idx) => {
                  const IconComponent = step.icon;
                  const active = activeStep === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setActiveStep(idx)}
                      onClick={() => setActiveStep(idx)}
                      className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start relative overflow-hidden ${active
                        ? 'bg-white border-primary shadow-[0_8px_30px_rgb(79,70,229,0.06)]'
                        : 'bg-transparent border-transparent hover:border-outline-variant/30 hover:bg-white/40'
                        }`}
                    >
                      {active && (
                        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden rounded-b-2xl">
                          <div 
                            className="h-full bg-primary"
                            style={{
                              animation: 'progress-bar 4s linear forwards',
                              animationPlayState: isStepsHovered ? 'paused' : 'running',
                            }}
                          />
                        </div>
                      )}
                      <div className={`p-3 rounded-xl transition-all ${active ? 'bg-primary text-white scale-110 shadow-md' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 0{idx + 1}</span>
                          {active && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                        </div>
                        <h3 className="font-jakarta font-bold text-lg text-on-surface mt-1">{step.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Step Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md bg-white border border-outline-variant/60 rounded-[2.5rem] p-6 shadow-2xl flex flex-col justify-between min-h-[380px]">
                  {/* Phone Bezel Simulator */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-4 bg-on-surface/5 rounded-full" />
                  <div className="pt-6 flex-1 flex flex-col justify-center">
                    {steps[activeStep].preview}
                  </div>
                  <div className="mt-8 flex justify-center gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeStep ? 'w-6 bg-primary' : 'w-1.5 bg-outline-variant'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Analytics Showcase */}
        <section className="py-24 bg-inverse-surface text-inverse-on-surface relative overflow-hidden" id="analytics-showcase">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 text-secondary font-semibold text-xs uppercase tracking-wider">
                  Advanced Insights
                </span>
                <h2 className="font-jakarta text-3xl md:text-5xl text-white mb-6 leading-tight font-bold">
                  Track every scan. <span className="text-secondary">Optimize performance.</span>
                </h2>
                <p className="text-outline-variant text-lg mb-8 leading-relaxed">
                  Understand your customer habits with detailed location, device, and timing analytics. Use the data to tailor shop operations and marketing spend.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 className="text-sm font-bold text-secondary">Device Metrics</h4>
                    <p className="text-xs text-outline-variant mt-1">See breakdown of iOS, Android and desktop scan methods.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 className="text-sm font-bold text-secondary">Peak Hours</h4>
                    <p className="text-xs text-outline-variant mt-1">Identify busiest store hours to plan staff shift levels.</p>
                  </div>
                </div>
              </div>

              {/* Simulated Stats Dashboard Mockup */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-outline-variant font-bold uppercase tracking-wider">Campaign Overview</span>
                    <h3 className="text-lg font-bold text-white">Bakery Promo Campaign</h3>
                  </div>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" /> Live Updating
                  </span>
                </div>

                {/* Stats Counters */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[10px] text-outline-variant">Scan Volume</span>
                    <p className="text-2xl font-bold text-white mt-1">1,284</p>
                    <span className="text-[9px] text-secondary font-medium">+12% this week</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[10px] text-outline-variant">Unique Users</span>
                    <p className="text-2xl font-bold text-white mt-1">842</p>
                    <span className="text-[9px] text-secondary font-medium">+8% this week</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[10px] text-outline-variant">Peak Hours</span>
                    <p className="text-2xl font-bold text-white mt-1">1 PM</p>
                    <span className="text-[9px] text-outline-variant">Lunch rush</span>
                  </div>
                </div>

                {/* Simulated Chart */}
                <div className="h-48 bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-start text-[10px] text-outline-variant z-10">
                    <div>
                      <span className="font-bold text-white/90 text-xs">Scan Traffic Graph</span>
                      <p className="text-[9px] text-white/40 font-medium">Real-time scan frequency</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #ff007f, #00f0ff)' }} />
                        <span className="text-[9px] text-white/70">This Week</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5 border-t-2 border-dashed border-amber-500/80" />
                        <span className="text-[9px] text-white/50">Last Week</span>
                      </div>
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-slate-950/95 border border-white/10 text-white p-2.5 rounded-xl text-[9px] shadow-2xl z-20 flex flex-col gap-0.5" style={{ top: '22%', left: '46%' }}>
                    <div className="font-bold text-white/95">Friday Peak</div>
                    <div className="text-[10px] text-[#00f0ff] font-bold">420 scans</div>
                    <div className="text-white/40 font-medium">Compared to last Fri: +25%</div>
                  </div>

                  {/* Fake Chart Lines */}
                  <div className="absolute inset-x-0 bottom-0 h-32 flex items-end px-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        {/* Main Stroke Gradient: Pink to Purple to Cyan */}
                        <linearGradient id="mainStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ff007f" />
                          <stop offset="50%" stopColor="#7928ca" />
                          <stop offset="100%" stopColor="#00f0ff" />
                        </linearGradient>

                        {/* Area Gradient: Fading Purple/Cyan to Transparent */}
                        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#7928ca" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#7928ca" stopOpacity="0.0" />
                        </linearGradient>

                        {/* Comparison Stroke Gradient: Fading Amber/Orange */}
                        <linearGradient id="compStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid Lines */}
                      <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                      <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />

                      {/* Vertical Guidance Line on Hover */}
                      <line x1="66.6" y1="0" x2="66.6" y2="100" stroke="rgba(255,255,255,0.12)" strokeDasharray="2,2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Last Week Line (Comparison) */}
                      <path 
                        d="M 0,85 C 8,85 8,75 16.6,75 C 25,75 25,70 33.3,70 C 41.6,70 41.6,55 50,55 C 58.3,55 58.3,40 66.6,40 C 75,40 75,30 83.3,30 C 91.6,30 91.6,60 100,60" 
                        fill="none" 
                        stroke="url(#compStrokeGrad)" 
                        strokeWidth="1.5" 
                        strokeDasharray="3,3"
                        style={{
                          strokeDasharray: '3,3',
                          animation: 'draw-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        }}
                      />

                      {/* Main Line Area Fill */}
                      <path 
                        d="M 0,75 C 8,75 8,60 16.6,60 C 25,60 25,80 33.3,80 C 41.6,80 41.6,45 50,45 C 58.3,45 58.3,15 66.6,15 C 75,15 75,50 83.3,50 C 91.6,50 91.6,70 100,70 L 100,100 L 0,100 Z" 
                        fill="url(#areaGrad)" 
                        className="origin-bottom"
                        style={{
                          animation: 'fade-in-fill 1.5s ease-out 0.8s both',
                        }}
                      />

                      {/* Main Line (Current Week) */}
                      <path 
                        d="M 0,75 C 8,75 8,60 16.6,60 C 25,60 25,80 33.3,80 C 41.6,80 41.6,45 50,45 C 58.3,45 58.3,15 66.6,15 C 75,15 75,50 83.3,50 C 91.6,50 91.6,70 100,70" 
                        fill="none" 
                        stroke="url(#mainStrokeGrad)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 400,
                          strokeDashoffset: 400,
                          animation: 'draw-line 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        }}
                      />

                      {/* Glowing Peak Dot on Friday (66.6, 15) */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Outer Glow */}
                        <circle 
                          cx="66.6" 
                          cy="15" 
                          r="6" 
                          fill="#00f0ff" 
                          fillOpacity="0.3" 
                          className="animate-ping" 
                          style={{ transformOrigin: '66.6px 15px' }} 
                        />
                        {/* Medium Ring */}
                        <circle 
                          cx="66.6" 
                          cy="15" 
                          r="4" 
                          fill="#00f0ff" 
                          fillOpacity="0.5" 
                        />
                        {/* Core Solid Circle */}
                        <circle 
                          cx="66.6" 
                          cy="15" 
                          r="2" 
                          fill="#fff" 
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="flex justify-between text-[8px] text-outline-variant pt-2 border-t border-white/5 z-10">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Solutions tabbed section */}
        <section className="py-24 bg-surface-container-lowest" id="solutions">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <span className="px-4 py-1.5 rounded-full bg-secondary/15 text-secondary font-medium text-xs uppercase tracking-wider">
                Tailored Approaches
              </span>
              <h2 className="font-jakarta text-3xl md:text-5xl text-on-surface mt-4 mb-4 font-bold">
                Built for Your Specific Industry
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                No matter what business you run, ShopQR helps you streamline operations and delight customers.
              </p>
            </div>

            {/* Tab switchers and panel with hover detection */}
            <div
              onMouseEnter={() => setIsTabsHovered(true)}
              onMouseLeave={() => setIsTabsHovered(false)}
            >
              {/* Tab switchers */}
              <div className="flex justify-center mb-12">
                <div className="flex items-center gap-2 bg-surface-container p-1.5 rounded-2xl border border-outline-variant">
                  {Object.keys(solutions).map((key) => {
                    const sol = solutions[key as keyof typeof solutions];
                    const active = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all relative overflow-hidden ${active
                          ? 'bg-white shadow-md text-primary'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-white/40'
                          }`}
                      >
                        {sol.title}
                        {active && (
                          <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{
                                animation: 'progress-bar 5s linear forwards',
                                animationPlayState: isTabsHovered ? 'paused' : 'running',
                              }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab panel */}
              <div className="bg-white border border-outline-variant/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0px_4px_30px_rgba(79,70,229,0.03)] min-h-[400px] text-left">
                {Object.keys(solutions).map((key) => {
                  const sol = solutions[key as keyof typeof solutions];
                  const active = activeTab === key;
                  if (!active) return null;
                  return (
                    <div key={key} className="grid lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7 space-y-6">
                        <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold ${sol.color}/10 ${sol.accent}`}>
                          {sol.badge}
                        </span>
                        <h3 className="font-jakarta text-3xl md:text-4xl text-on-surface font-bold">
                          Transforming {sol.title}
                        </h3>
                        <p className="text-on-surface-variant text-lg font-medium">
                          {sol.tagline}
                        </p>
                        <ul className="space-y-4">
                          {sol.points.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-on-surface-variant">
                              <div className="mt-1 bg-secondary-container rounded-full p-1 flex items-center justify-center text-on-secondary-container">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <span className="leading-relaxed">{pt}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4">
                          <Link
                            href="/dashboard"
                            className="bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
                          >
                            Deploy This Solution <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                      <div className="lg:col-span-5 rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/40">
                        <img
                          src={sol.img}
                          alt={sol.title}
                          className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive FAQ accordion section */}
        <section className="py-24 bg-surface" id="faq">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider">
                Support & Info
              </span>
              <h2 className="font-jakarta text-3xl md:text-5xl text-on-surface mt-4 mb-4 font-bold">
                Frequently Asked Questions
              </h2>
              <p className="text-on-surface-variant">
                Got questions? We have answers to help you get the most out of ShopQR.
              </p>
            </div>

            <div className="space-y-4 text-left">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-outline-variant/60 rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-surface-container/20 transition-colors"
                    >
                      <span className="font-jakarta font-bold text-on-surface text-base md:text-lg">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                    >
                      <p className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-surface" id="pricing">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="font-jakarta text-3xl md:text-5xl text-on-surface mb-4 font-bold">
                Simple, Transparent Pricing
              </h2>
              <p className="text-on-surface-variant">Scale your shop without breaking the bank.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Free Tier */}
              <div className="p-8 rounded-3xl border border-outline-variant bg-white">
                <h3 className="font-jakarta text-xl text-on-surface mb-2 font-semibold">Essential</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-on-surface-variant">/forever</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> 5 Static QR Codes
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Basic Design Templates
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <XCircle className="text-outline-variant w-5 h-5" /> Scan Analytics
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full py-3 rounded-xl border border-primary text-primary font-medium text-sm hover:bg-primary-container/5 transition-colors block text-center">
                  Start for Free
                </Link>
              </div>
              {/* Pro Tier */}
              <div className="p-8 rounded-3xl border-2 border-primary bg-primary-container/5 relative shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                  Most Popular
                </div>
                <h3 className="font-jakarta text-xl text-on-surface mb-2 font-semibold">Starter Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">₹49</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Unlimited Dynamic QRs
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Advanced Analytics Dashboard
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Custom Branding & Logos
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Password Protected Links
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:shadow-lg transition-all block text-center">
                  Go Pro Now
                </Link>
              </div>
              {/* Business Tier */}
              <div className="p-8 rounded-3xl border border-outline-variant bg-white">
                <h3 className="font-jakarta text-xl text-on-surface mb-2 font-semibold">Agency</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">₹299</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Everything in Pro
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> Multi-Store Management
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-secondary w-5 h-5" /> API Access & Webhooks
                  </li>
                </ul>
                <button onClick={() => toast.info('Our sales team will contact you shortly!', { description: 'We typically respond within 24 hours.' })} className="w-full py-3 rounded-xl border border-outline text-on-surface font-medium text-sm hover:bg-surface-container transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-inverse-surface rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <h2 className="font-jakarta text-3xl md:text-5xl text-inverse-on-surface mb-6 font-bold">
                  Ready to transform your shop floor?
                </h2>
                <p className="text-lg text-outline-variant mb-10 max-w-2xl mx-auto">
                  Join thousands of local business owners who are modernizing their customer experience with ShopQR.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link
                    href="/dashboard"
                    className="bg-primary text-white font-semibold px-10 py-5 rounded-2xl hover:scale-105 transition-transform shadow-2xl"
                  >
                    Get Started for Free
                  </Link>
                  <button onClick={() => toast.info('Our team will contact you shortly!', { description: 'We typically respond within 24 hours.' })} className="border border-outline-variant text-inverse-on-surface font-semibold px-10 py-5 rounded-2xl hover:bg-white/5 transition-colors">
                    Talk to an Expert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="font-jakarta text-lg font-bold text-primary hover:opacity-80 transition-opacity">ShopQR</Link>
          <p className="text-sm text-on-surface-variant text-center md:text-left">
            © 2024 ShopQR. Empowering local businesses globally.
          </p>
        </div>
        <div className="flex gap-8">
          <a href="#faq" className="text-on-surface-variant text-xs font-medium hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#faq" className="text-on-surface-variant text-xs font-medium hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#faq" className="text-on-surface-variant text-xs font-medium hover:text-primary transition-colors">
            Contact Support
          </a>
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <Globe className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
