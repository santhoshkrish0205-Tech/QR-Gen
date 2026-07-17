import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Globe, ArrowLeft, CheckCircle, Users, Lock, FileText, Mail,
  Eye, Pencil, Trash2, PauseCircle, Package, Ban, BotMessageSquare, ClipboardX,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'GDPR Compliance — ShopQR Pro',
  description: 'Learn how ShopQR Pro complies with the General Data Protection Regulation (GDPR) and your rights as a data subject.',
};

const rights: { icon: LucideIcon; color: string; bg: string; title: string; desc: string; article: string }[] = [
  {
    icon: Eye,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Right to Access',
    desc: 'You can request a full copy of all personal data we hold about you. We will respond within 30 days.',
    article: 'Art. 15 GDPR',
  },
  {
    icon: Pencil,
    color: 'text-shopsecondary',
    bg: 'bg-shopsecondary/10',
    title: 'Right to Rectification',
    desc: 'You may correct any inaccurate or incomplete personal data we hold about you at any time.',
    article: 'Art. 16 GDPR',
  },
  {
    icon: Trash2,
    color: 'text-error',
    bg: 'bg-error/10',
    title: 'Right to Erasure',
    desc: 'You can request deletion of your personal data ("right to be forgotten"), subject to legal retention obligations.',
    article: 'Art. 17 GDPR',
  },
  {
    icon: PauseCircle,
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    title: 'Right to Restriction',
    desc: 'You may request that we limit how we process your data while a dispute or objection is being resolved.',
    article: 'Art. 18 GDPR',
  },
  {
    icon: Package,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Right to Portability',
    desc: 'You can receive your data in a structured, machine-readable format and transfer it to another provider.',
    article: 'Art. 20 GDPR',
  },
  {
    icon: Ban,
    color: 'text-error',
    bg: 'bg-error/10',
    title: 'Right to Object',
    desc: 'You may object to data processing based on legitimate interests or direct marketing at any time.',
    article: 'Art. 21 GDPR',
  },
  {
    icon: BotMessageSquare,
    color: 'text-shopsecondary',
    bg: 'bg-shopsecondary/10',
    title: 'Rights re: Automated Decisions',
    desc: 'You have the right not to be subject to decisions made solely by automated processing that significantly affect you.',
    article: 'Art. 22 GDPR',
  },
  {
    icon: ClipboardX,
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    title: 'Right to Withdraw Consent',
    desc: 'Where processing is based on consent, you may withdraw it at any time without affecting prior processing.',
    article: 'Art. 7(3) GDPR',
  },
];

const measures = [
  { icon: Lock, title: 'Encryption', desc: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256).' },
  { icon: Users, title: 'Access Controls', desc: 'Role-based access ensures only authorized personnel can access personal data.' },
  { icon: FileText, title: 'Data Processing Agreements', desc: 'All sub-processors are bound by GDPR-compliant DPAs.' },
  { icon: Globe, title: 'Data Residency', desc: 'EU customer data is processed and stored within EU data centers by default.' },
  { icon: CheckCircle, title: 'Breach Notification', desc: 'We notify supervisory authorities within 72 hours of discovering a data breach.' },
  { icon: Mail, title: 'DPO Appointed', desc: 'We have a designated Data Protection Officer available at dpo@shopqr.co.' },
];

const legalBases = [
  { basis: 'Contract Performance', example: 'Processing your account data to deliver QR code services you subscribed to.' },
  { basis: 'Legitimate Interests', example: 'Analyzing aggregate platform usage to improve performance and detect abuse.' },
  { basis: 'Consent', example: 'Sending marketing emails and placing non-essential analytics cookies.' },
  { basis: 'Legal Obligation', example: 'Retaining billing records to comply with tax and financial regulations.' },
];

export default function GdprPage() {
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
      <div className="bg-gradient-to-b from-shopsecondary/5 to-transparent py-16 px-6 md:px-12 border-b border-outline-variant/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-shopsecondary/10 rounded-2xl">
              <Globe className="w-7 h-7 text-shopsecondary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-shopsecondary bg-shopsecondary/10 px-3 py-1 rounded-full border border-shopsecondary/20">
              Legal · EU Regulation
            </span>
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
            GDPR Compliance
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            ShopQR Pro is committed to full compliance with the General Data Protection Regulation (EU) 2016/679. This page describes how we implement your rights and fulfill our obligations as a data controller.
          </p>
          <p className="text-sm text-on-surface-variant mt-4 font-medium">
            <span className="font-bold text-on-surface">Applicable to:</span> EU/EEA residents and businesses &nbsp;·&nbsp;
            <span className="font-bold text-on-surface">Last Updated:</span> July 1, 2026
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-16">

        {/* Our Role */}
        <div className="bg-white rounded-3xl border border-outline-variant/50 p-8 shadow-sm">
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-4">Our Role Under GDPR</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Data Controller</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                ShopQR Pro acts as a <strong className="text-on-surface">Data Controller</strong> for data collected directly from you — such as your account information, billing details, and usage analytics on our platform.
              </p>
            </div>
            <div className="p-5 bg-shopsecondary/5 rounded-2xl border border-shopsecondary/10">
              <p className="text-xs font-bold uppercase tracking-wider text-shopsecondary mb-2">Data Processor</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                When you use ShopQR Pro to generate QR codes that collect data from your customers, you act as the Data Controller and ShopQR Pro acts as your <strong className="text-on-surface">Data Processor</strong>. We enter into Data Processing Agreements (DPAs) on request.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Bases */}
        <div>
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-6">Lawful Bases for Processing</h2>
          <div className="bg-white rounded-3xl border border-outline-variant/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Legal Basis</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Example Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {legalBases.map((row) => (
                    <tr key={row.basis} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-primary text-sm">{row.basis}</td>
                      <td className="py-4 px-6 text-on-surface-variant text-sm leading-relaxed">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div>
          <div className="mb-8">
            <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-2">Your Data Subject Rights</h2>
            <p className="text-on-surface-variant text-sm">As an EU/EEA resident, you have the following rights under GDPR. To exercise any right, contact us at <a href="mailto:privacy@shopqr.co" className="text-primary font-medium hover:underline">privacy@shopqr.co</a>.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rights.map((right) => (
              <div key={right.title} className="bg-white rounded-2xl border border-outline-variant/50 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${right.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <right.icon className={`w-5 h-5 ${right.color}`} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-on-surface text-sm leading-snug">{right.title}</h3>
                    <span className="text-[10px] font-bold text-shopsecondary bg-shopsecondary/10 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">{right.article}</span>
                  </div>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{right.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Measures */}
        <div>
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-6">Technical & Organizational Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {measures.map((m) => (
              <div key={m.title} className="bg-white rounded-2xl border border-outline-variant/50 p-6 shadow-sm flex flex-col gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl w-fit">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface text-sm">{m.title}</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* International Transfers */}
        <div className="bg-white rounded-3xl border border-outline-variant/50 p-8 shadow-sm">
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-4">International Data Transfers</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
            ShopQR Pro primarily processes data within the European Economic Area (EEA). Where data is transferred outside the EEA (e.g., to US-based sub-processors such as analytics services), we ensure adequate safeguards through:
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            {[
              'EU Standard Contractual Clauses (SCCs) — the primary mechanism for transfers to non-adequate countries',
              'Adequacy Decisions — transfers to countries recognized by the European Commission as providing adequate protection',
              'Binding Corporate Rules — where applicable for intra-group transfers',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-shopsecondary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact DPO */}
        <div className="bg-gradient-to-br from-primary/5 to-shopsecondary/5 rounded-3xl border border-outline-variant/50 p-8">
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-2">Contact Our Data Protection Officer</h2>
          <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
            If you have any GDPR-related inquiries, wish to exercise your rights, or have concerns about how we handle your data, please contact our Data Protection Officer directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:dpo@shopqr.co"
              className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              dpo@shopqr.co
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-3 px-6 py-3 bg-white border border-outline-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-container transition-colors"
            >
              Open Support Ticket
            </Link>
          </div>
          <p className="text-xs text-on-surface-variant mt-4">
            You also have the right to lodge a complaint with your local supervisory authority (e.g., the ICO in the UK or your national DPA in the EU).
          </p>
        </div>

        {/* Related */}
        <div className="p-8 bg-surface-container rounded-3xl border border-outline-variant/50">
          <p className="text-sm font-semibold text-on-surface mb-4">Related Legal Documents</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-sm font-medium text-primary hover:underline">Privacy Policy</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/terms-of-service" className="text-sm font-medium text-primary hover:underline">Terms of Service</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/cookie-policy" className="text-sm font-medium text-primary hover:underline">Cookie Policy</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/contact" className="text-sm font-medium text-primary hover:underline">Contact Support</Link>
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
