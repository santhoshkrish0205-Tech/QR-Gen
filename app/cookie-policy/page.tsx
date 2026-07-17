import Link from 'next/link';
import type { Metadata } from 'next';
import { Cookie, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy — ShopQR Pro',
  description: 'Understand how ShopQR Pro uses cookies and tracking technologies on our platform.',
};

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    badge: 'Always Active',
    badgeColor: 'bg-shopsecondary/10 text-shopsecondary border-shopsecondary/20',
    description: 'These cookies are essential for the platform to function and cannot be disabled.',
    examples: [
      { cookie: 'session_id', purpose: 'Maintains your login session across pages', duration: 'Session' },
      { cookie: 'csrf_token', purpose: 'Protects against cross-site request forgery attacks', duration: 'Session' },
      { cookie: 'auth_state', purpose: 'Stores authentication status to prevent repeated logins', duration: '30 days' },
    ],
  },
  {
    name: 'Functional',
    badge: 'Optional',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    description: 'These cookies enable enhanced functionality such as remembering your preferences.',
    examples: [
      { cookie: 'theme_pref', purpose: 'Remembers your light/dark mode preference', duration: '1 year' },
      { cookie: 'sidebar_state', purpose: 'Stores sidebar open/collapsed state', duration: '90 days' },
      { cookie: 'locale', purpose: 'Remembers your language or regional format preference', duration: '1 year' },
    ],
  },
  {
    name: 'Analytics',
    badge: 'Optional',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    description: 'These cookies help us understand how visitors interact with our platform.',
    examples: [
      { cookie: '_ga', purpose: 'Google Analytics — tracks unique visitors and session counts', duration: '2 years' },
      { cookie: '_gid', purpose: 'Google Analytics — distinguishes users across sessions', duration: '24 hours' },
      { cookie: 'amplitude_id', purpose: 'Amplitude — tracks feature usage and in-app behavior', duration: '10 years' },
    ],
  },
  {
    name: 'Marketing',
    badge: 'Optional',
    badgeColor: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    description: 'These cookies are used to deliver relevant advertisements and track campaign performance.',
    examples: [
      { cookie: 'fbp', purpose: 'Facebook Pixel — measures ad campaign effectiveness', duration: '90 days' },
      { cookie: 'gcl_au', purpose: 'Google Ads — links ad clicks to conversions on our site', duration: '90 days' },
    ],
  },
];

const sections = [
  {
    title: 'What Are Cookies?',
    text: 'Cookies are small text files placed on your device when you visit a website. They help websites remember information about your visit, such as your preferences and login state, making your experience smoother and more personalized. Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (remaining on your device for a set period).',
  },
  {
    title: 'How We Use Cookies',
    text: 'ShopQR Pro uses cookies for four primary purposes: to keep you logged in and protect your account (strictly necessary), to remember your display and language preferences (functional), to understand how our platform is used and where we can improve (analytics), and to measure the effectiveness of our marketing campaigns (marketing).',
  },
  {
    title: 'Third-Party Cookies',
    text: 'Some cookies on our platform are set by third-party services we use, such as Google Analytics, Amplitude, and Facebook Pixel. These services have their own privacy policies governing how they use the data collected. We recommend reviewing their policies for full details. We do not control how third-party cookies operate.',
  },
  {
    title: 'Managing Cookies',
    text: 'You can control cookies through our Cookie Preferences Center (accessible via the banner on your first visit) or through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling strictly necessary cookies may impact the functionality of ShopQR Pro. To opt out of Google Analytics, you can install the Google Analytics Opt-out Browser Add-on.',
  },
  {
    title: 'Do Not Track',
    text: 'Some browsers have a "Do Not Track" feature. Currently, there is no industry standard for how websites should respond to these signals. ShopQR Pro does not currently respond to Do Not Track signals, but we provide opt-out options for analytics and marketing cookies through our Cookie Preferences Center.',
  },
  {
    title: 'Updates to This Policy',
    text: 'We may update this Cookie Policy periodically to reflect changes in technology, regulation, or our cookie usage. When we make material changes, we will update the "Last Updated" date and may display a new cookie consent notice. We encourage you to review this page regularly.',
  },
];

export default function CookiePolicyPage() {
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
      <div className="bg-gradient-to-b from-tertiary/5 to-transparent py-16 px-6 md:px-12 border-b border-outline-variant/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-tertiary/10 rounded-2xl">
              <Cookie className="w-7 h-7 text-tertiary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-tertiary bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
              Legal
            </span>
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
            Cookie Policy
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
            This policy explains how ShopQR Pro uses cookies and similar tracking technologies to power our platform and improve your experience.
          </p>
          <p className="text-sm text-on-surface-variant mt-4 font-medium">
            <span className="font-bold text-on-surface">Effective Date:</span> January 1, 2024 &nbsp;·&nbsp;
            <span className="font-bold text-on-surface">Last Updated:</span> July 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-12">

        {/* Intro Sections */}
        <div className="space-y-6">
          {sections.slice(0, 2).map((s) => (
            <div key={s.title} className="bg-white rounded-3xl border border-outline-variant/50 p-8 shadow-sm">
              <h2 className="font-jakarta text-xl font-bold text-on-surface mb-3">{s.title}</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Cookie Table */}
        <div>
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-6">Cookies We Use</h2>
          <div className="space-y-6">
            {cookieTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-3xl border border-outline-variant/50 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
                  <div>
                    <h3 className="font-jakarta text-lg font-bold text-on-surface">{type.name} Cookies</h3>
                    <p className="text-sm text-on-surface-variant mt-1">{type.description}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ml-4 ${type.badgeColor}`}>
                    {type.badge}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cookie Name</th>
                        <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Purpose</th>
                        <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {type.examples.map((ex) => (
                        <tr key={ex.cookie} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs font-semibold text-primary">{ex.cookie}</td>
                          <td className="py-4 px-6 text-on-surface-variant text-xs">{ex.purpose}</td>
                          <td className="py-4 px-6 text-on-surface text-xs font-medium">{ex.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Sections */}
        <div className="space-y-6">
          {sections.slice(2).map((s) => (
            <div key={s.title} className="bg-white rounded-3xl border border-outline-variant/50 p-8 shadow-sm">
              <h2 className="font-jakarta text-xl font-bold text-on-surface mb-3">{s.title}</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="p-8 bg-surface-container rounded-3xl border border-outline-variant/50">
          <p className="text-sm font-semibold text-on-surface mb-2">Questions about cookies?</p>
          <p className="text-sm text-on-surface-variant mb-4">
            Email us at <a href="mailto:privacy@shopqr.co" className="text-primary font-medium hover:underline">privacy@shopqr.co</a> or visit our{' '}
            <Link href="/contact" className="text-primary font-medium hover:underline">Contact Support</Link> page.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-sm font-medium text-primary hover:underline">Privacy Policy</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/terms-of-service" className="text-sm font-medium text-primary hover:underline">Terms of Service</Link>
            <span className="text-outline-variant">·</span>
            <Link href="/gdpr" className="text-sm font-medium text-primary hover:underline">GDPR Compliance</Link>
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
