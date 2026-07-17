import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — ShopQR Pro',
  description: 'Learn how ShopQR Pro collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      {
        subtitle: '1.1 Information You Provide',
        text: 'When you create a ShopQR Pro account or use our services, we may collect: your store name, email address, business details, QR code content (URLs, Wi-Fi credentials, menu links), brand customization preferences, and payment information processed securely through our payment partners.',
      },
      {
        subtitle: '1.2 Information Collected Automatically',
        text: 'When you interact with our platform, we automatically collect: browser type and version, operating system, IP address, referring URLs, pages visited and time spent, QR code scan events (device type, approximate location, timestamp), and performance and error data.',
      },
      {
        subtitle: '1.3 Information from Third Parties',
        text: 'We may receive information about you from third-party services such as Google Analytics, payment processors, and social login providers (if applicable), subject to their respective privacy policies.',
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: '2.1 Service Delivery',
        text: 'We use your information to create and manage your account, generate and host your QR codes, provide analytics and reporting dashboards, process payments and send receipts, and deliver customer support.',
      },
      {
        subtitle: '2.2 Service Improvement',
        text: 'Your data helps us understand how ShopQR Pro is used, identify bugs and usability issues, develop new features, and optimize platform performance.',
      },
      {
        subtitle: '2.3 Communications',
        text: 'With your consent, we may send product updates, feature announcements, security alerts, and promotional offers. You may opt out of marketing communications at any time via the unsubscribe link in any email.',
      },
    ],
  },
  {
    title: '3. How We Share Your Information',
    content: [
      {
        subtitle: '3.1 Service Providers',
        text: 'We share data with trusted third-party vendors who help us operate our platform, including cloud hosting providers, payment processors, analytics services, and customer support tools. These providers are contractually bound to handle your data securely.',
      },
      {
        subtitle: '3.2 Legal Requirements',
        text: 'We may disclose your information when required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights, prevent fraud, or ensure the safety of our users.',
      },
      {
        subtitle: '3.3 Business Transfers',
        text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email or a prominent notice on our website.',
      },
    ],
  },
  {
    title: '4. Data Retention',
    content: [
      {
        subtitle: '4.1 Retention Period',
        text: 'We retain your personal data for as long as your account is active or as needed to provide services. QR code scan analytics are retained for up to 24 months. After account deletion, anonymized aggregate data may be retained for statistical purposes.',
      },
      {
        subtitle: '4.2 Deletion Requests',
        text: 'You may request deletion of your personal data at any time by contacting us at privacy@shopqr.co. We will process your request within 30 days, subject to legal obligations that may require us to retain certain records.',
      },
    ],
  },
  {
    title: '5. Data Security',
    content: [
      {
        subtitle: '5.1 Technical Safeguards',
        text: 'We implement industry-standard security measures including TLS/SSL encryption for data in transit, AES-256 encryption for data at rest, regular security audits, role-based access controls, and multi-factor authentication for administrative access.',
      },
      {
        subtitle: '5.2 Breach Notification',
        text: 'In the event of a data breach affecting your personal information, we will notify you within 72 hours of becoming aware of the breach, consistent with applicable legal requirements.',
      },
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      {
        subtitle: '6.1 Access & Portability',
        text: 'You have the right to access the personal data we hold about you and request a portable copy of your data in a machine-readable format.',
      },
      {
        subtitle: '6.2 Correction & Erasure',
        text: 'You may correct inaccurate data or request erasure of your personal information, subject to our legal obligations.',
      },
      {
        subtitle: '6.3 Objection & Restriction',
        text: 'You may object to or request restriction of certain data processing activities, including profiling and direct marketing.',
      },
    ],
  },
  {
    title: '7. Cookies',
    content: [
      {
        subtitle: '7.1 Our Use of Cookies',
        text: 'We use cookies and similar tracking technologies to maintain session state, remember your preferences, and analyze platform usage. For full details, please review our Cookie Policy.',
      },
    ],
  },
  {
    title: '8. Children\'s Privacy',
    content: [
      {
        subtitle: '8.1 Age Restriction',
        text: 'ShopQR Pro is not directed at children under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.',
      },
    ],
  },
  {
    title: '9. Changes to This Policy',
    content: [
      {
        subtitle: '9.1 Updates',
        text: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of ShopQR Pro after changes constitutes acceptance of the updated policy.',
      },
    ],
  },
  {
    title: '10. Contact Us',
    content: [
      {
        subtitle: '10.1 Privacy Inquiries',
        text: 'If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at: privacy@shopqr.co or write to us at ShopQR Pro, Data Privacy Team, 123 Business Park, Tech City, 560001.',
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Legal
            </span>
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            We respect your privacy and are committed to protecting your personal data. This policy explains how ShopQR Pro collects, uses, and safeguards your information.
          </p>
          <p className="text-sm text-on-surface-variant mt-4 font-medium">
            <span className="font-bold text-on-surface">Effective Date:</span> January 1, 2024 &nbsp;·&nbsp;
            <span className="font-bold text-on-surface">Last Updated:</span> July 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-3xl border border-outline-variant/50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-jakarta text-xl font-bold text-on-surface mb-6 pb-4 border-b border-outline-variant/30">
                {section.title}
              </h2>
              <div className="space-y-5">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h3 className="font-semibold text-sm text-primary mb-2">{item.subtitle}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Related Links */}
        <div className="mt-12 p-8 bg-surface-container rounded-3xl border border-outline-variant/50">
          <p className="text-sm font-semibold text-on-surface mb-4">Related Legal Documents</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/terms-of-service" className="text-sm font-medium text-primary hover:underline">Terms of Service</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/cookie-policy" className="text-sm font-medium text-primary hover:underline">Cookie Policy</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/gdpr" className="text-sm font-medium text-primary hover:underline">GDPR Compliance</Link>
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
