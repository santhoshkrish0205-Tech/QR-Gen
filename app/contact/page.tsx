'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  ArrowLeft,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Zap,
} from 'lucide-react';

const faqs = [
  {
    q: 'How do I reset my QR code destination URL?',
    a: 'Navigate to the Dashboard, find the QR code you want to update, click the Edit (pencil) icon, enter the new URL, and click Save. Your QR code image stays the same — only the destination changes.',
  },
  {
    q: 'Can I download my QR code in high resolution?',
    a: 'Yes! From the Dashboard, click the Download button on any QR code to export a 1024×1024 PNG. The Generator page also offers Copy and Share options.',
  },
  {
    q: 'Why is my QR code showing as "Paused"?',
    a: 'A paused QR code does not redirect scanners to your destination. You can toggle the status back to "Active" from the Dashboard at any time.',
  },
  {
    q: 'How do I upgrade from Free to Pro?',
    a: 'Visit the Pricing section on the homepage and click "Get Started" under the Pro plan. Our billing system will guide you through the payment process.',
  },
  {
    q: 'Is my Wi-Fi password stored securely?',
    a: 'Wi-Fi credentials you enter are stored locally in your browser\'s storage and used only to generate the QR code string. We recommend using a dedicated guest network password rather than your main Wi-Fi password.',
  },
];

const channels = [
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Send us a detailed message and we\'ll respond within 24 hours.',
    action: 'support@shopqr.co',
    href: 'mailto:support@shopqr.co',
    color: 'bg-primary/10 text-primary',
    badge: 'Avg. 24h response',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    desc: 'Chat with our support team in real time during business hours.',
    action: 'Start Chat',
    href: '#',
    color: 'bg-shopsecondary/10 text-shopsecondary',
    badge: 'Mon–Fri, 9 AM – 6 PM IST',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    desc: 'Pro and Enterprise customers can call our dedicated support line.',
    action: '+91 80 1234 5678',
    href: 'tel:+918012345678',
    color: 'bg-tertiary/10 text-tertiary',
    badge: 'Pro & Enterprise only',
  },
];

export default function ContactSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', category: 'General Inquiry' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message sent!', { description: 'Our team will get back to you within 24 hours.' });
    setForm({ name: '', email: '', subject: '', message: '', category: 'General Inquiry' });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-shopbg text-on-surface">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/40 px-6 md:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="font-jakarta text-2xl font-extrabold text-primary hover:scale-105 transition-transform">
          ShopQR
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-6 md:px-12 border-b border-outline-variant/30">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider border border-primary/20">
            <MessageSquare className="w-3.5 h-3.5" />
            Support Center
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
            How can we help you?
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl mx-auto">
            Our team is here for you. Reach out via your preferred channel or browse the FAQs below for instant answers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-20">

        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch) => (
            <a
              key={ch.title}
              href={ch.href}
              onClick={ch.href === '#' ? (e) => { e.preventDefault(); toast.info('Live chat coming soon!', { description: 'Try email support in the meantime.' }); } : undefined}
              className="group bg-white rounded-3xl border border-outline-variant/50 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ch.color} group-hover:scale-110 transition-transform duration-300`}>
                <ch.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-jakarta text-lg font-bold text-on-surface mb-1">{ch.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{ch.desc}</p>
                <p className="text-sm font-bold text-primary">{ch.action}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                <Clock className="w-3.5 h-3.5" />
                {ch.badge}
              </div>
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface mb-1">Documentation</h3>
              <p className="text-sm text-on-surface-variant mb-3">Step-by-step guides for every ShopQR Pro feature.</p>
              <button onClick={() => toast.info('Docs site coming soon!')} className="text-sm font-bold text-primary hover:underline">Browse Docs →</button>
            </div>
          </div>
          <div className="bg-shopsecondary/5 border border-shopsecondary/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2.5 bg-shopsecondary/10 rounded-xl shrink-0">
              <Zap className="w-5 h-5 text-shopsecondary" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface mb-1">Status Page</h3>
              <p className="text-sm text-on-surface-variant mb-3">Check real-time platform uptime and incident history.</p>
              <button onClick={() => toast.info('Status page coming soon!')} className="text-sm font-bold text-shopsecondary hover:underline">View Status →</button>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-2">
            <h2 className="font-jakarta text-3xl font-extrabold text-on-surface mb-3">Send us a message</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Fill in the form and one of our support specialists will reach out to you within one business day.</p>
            <div className="space-y-3 text-sm text-on-surface-variant">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary shrink-0" /> 123 Business Park, Tech City, Bengaluru 560001</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /> support@shopqr.co</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary shrink-0" /> Mon – Fri, 9 AM – 6 PM IST</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-3xl border border-outline-variant/50 p-8 shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name <span className="text-error">*</span></label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email <span className="text-error">*</span></label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@business.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                {['General Inquiry', 'Billing & Subscription', 'Technical Issue', 'Feature Request', 'Account Management', 'GDPR / Privacy'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Briefly describe your issue"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Message <span className="text-error">*</span></label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what happened and how we can help..."
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="animate-pulse">Sending…</span>
              ) : (
                <><Send className="w-4 h-4" /> Send Message</>
              )}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div>
          <div className="text-center mb-10">
            <h2 className="font-jakarta text-3xl font-extrabold text-on-surface mb-2">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant text-sm">Quick answers to the most common questions.</p>
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left p-6 font-semibold text-sm text-on-surface hover:bg-surface-container-low/50 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0 text-primary" /> : <ChevronDown className="w-4 h-4 shrink-0 text-on-surface-variant" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-outline-variant py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-lowest">
        <p className="text-sm text-on-surface-variant">© 2024 ShopQR Pro. All rights reserved.</p>
        <div className="flex gap-6 text-xs font-medium text-on-surface-variant">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookies</Link>
          <Link href="/gdpr" className="hover:text-primary transition-colors">GDPR</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
