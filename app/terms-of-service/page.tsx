import Link from 'next/link';
import type { Metadata } from 'next';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — ShopQR Pro',
  description: 'Read the ShopQR Pro terms and conditions governing the use of our QR code platform.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      {
        subtitle: '1.1 Agreement',
        text: 'By accessing or using ShopQR Pro ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service. These Terms apply to all visitors, users, and business account holders.',
      },
      {
        subtitle: '1.2 Modifications',
        text: 'ShopQR Pro reserves the right to update or modify these Terms at any time. We will provide at least 14 days\' notice before material changes take effect. Continued use of the Service after changes constitutes acceptance.',
      },
    ],
  },
  {
    title: '2. Description of Service',
    content: [
      {
        subtitle: '2.1 Platform',
        text: 'ShopQR Pro provides a cloud-based QR code generation, management, and analytics platform for businesses. Features include dynamic QR code creation, scan tracking, brand customization, digital menu hosting, Wi-Fi QR codes, and payment QR codes.',
      },
      {
        subtitle: '2.2 Service Availability',
        text: 'We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance will be announced in advance. We are not liable for temporary service disruptions due to maintenance, upgrades, or circumstances beyond our control.',
      },
    ],
  },
  {
    title: '3. Account Registration',
    content: [
      {
        subtitle: '3.1 Eligibility',
        text: 'You must be at least 18 years old and have the legal authority to enter into contracts on behalf of your business. By registering, you represent that all information provided is accurate and current.',
      },
      {
        subtitle: '3.2 Account Security',
        text: 'You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately at security@shopqr.co of any unauthorized use of your account. ShopQR Pro is not liable for losses resulting from unauthorized account access due to your failure to secure credentials.',
      },
      {
        subtitle: '3.3 One Account Per Business',
        text: 'Each business entity may maintain one account under the Free or Pro plans. Enterprise plans may include multi-seat access as defined in the respective subscription agreement.',
      },
    ],
  },
  {
    title: '4. Acceptable Use Policy',
    content: [
      {
        subtitle: '4.1 Permitted Use',
        text: 'You may use ShopQR Pro solely for lawful business purposes, including promoting your goods and services, facilitating customer Wi-Fi access, accepting digital payments, and gathering customer feedback.',
      },
      {
        subtitle: '4.2 Prohibited Activities',
        text: 'You must not use ShopQR Pro to: distribute malware or phishing content via QR codes, engage in fraudulent or deceptive practices, violate any applicable local, national, or international law, infringe third-party intellectual property rights, send unsolicited commercial communications, or circumvent any security measures of the platform.',
      },
      {
        subtitle: '4.3 Content Responsibility',
        text: 'You are solely responsible for all content linked to or transmitted via your QR codes. ShopQR Pro does not review the destination content of QR codes and is not liable for any content accessed via your codes.',
      },
    ],
  },
  {
    title: '5. Subscription and Billing',
    content: [
      {
        subtitle: '5.1 Plans',
        text: 'ShopQR Pro offers Free, Pro, and Enterprise subscription tiers. Plan features and pricing are described on the Pricing page and are subject to change with 30 days\' prior notice.',
      },
      {
        subtitle: '5.2 Payment',
        text: 'Paid subscriptions are billed monthly or annually in advance. All fees are non-refundable except as required by law or as described in our Refund Policy. Prices are in INR (₹) unless otherwise specified.',
      },
      {
        subtitle: '5.3 Cancellation',
        text: 'You may cancel your subscription at any time. Upon cancellation, your account will remain on the paid plan until the end of the current billing period, after which it will downgrade to the Free plan.',
      },
      {
        subtitle: '5.4 Late Payments',
        text: 'Failure to pay subscription fees may result in suspension or termination of your account. We reserve the right to charge a late fee of 1.5% per month on overdue balances.',
      },
    ],
  },
  {
    title: '6. Intellectual Property',
    content: [
      {
        subtitle: '6.1 Our IP',
        text: 'ShopQR Pro, its logo, design, software, and all associated content are owned by or licensed to ShopQR Pro and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.',
      },
      {
        subtitle: '6.2 Your Content',
        text: 'You retain ownership of all content you upload to ShopQR Pro, including logos, menu items, and linked URLs. By uploading content, you grant us a non-exclusive, royalty-free license to store, process, and display your content as necessary to provide the Service.',
      },
    ],
  },
  {
    title: '7. Disclaimer of Warranties',
    content: [
      {
        subtitle: '7.1 "As Is" Service',
        text: 'The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      },
    ],
  },
  {
    title: '8. Limitation of Liability',
    content: [
      {
        subtitle: '8.1 Cap on Damages',
        text: 'To the maximum extent permitted by law, ShopQR Pro\'s total liability to you for any claims arising from these Terms or your use of the Service shall not exceed the fees you paid in the 12 months preceding the claim.',
      },
      {
        subtitle: '8.2 Exclusion of Consequential Damages',
        text: 'ShopQR Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruption.',
      },
    ],
  },
  {
    title: '9. Termination',
    content: [
      {
        subtitle: '9.1 By You',
        text: 'You may terminate your account at any time by contacting support or using the account deletion feature in Settings.',
      },
      {
        subtitle: '9.2 By Us',
        text: 'We may suspend or terminate your account immediately if you violate these Terms, engage in fraudulent activity, or fail to pay applicable fees. We will endeavour to provide advance notice unless immediate termination is required for security or legal reasons.',
      },
    ],
  },
  {
    title: '10. Governing Law',
    content: [
      {
        subtitle: '10.1 Jurisdiction',
        text: 'These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.',
      },
    ],
  },
];

export default function TermsOfServicePage() {
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
      <div className="bg-gradient-to-b from-secondary/5 to-transparent py-16 px-6 md:px-12 border-b border-outline-variant/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <FileText className="w-7 h-7 text-shopsecondary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-shopsecondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              Legal
            </span>
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            These terms govern your access to and use of the ShopQR Pro platform. Please read them carefully before using our services.
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
                    <h3 className="font-semibold text-sm text-shopsecondary mb-2">{item.subtitle}</h3>
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
            <Link href="/privacy-policy" className="text-sm font-medium text-primary hover:underline">Privacy Policy</Link>
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
