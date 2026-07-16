import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Link href="/" className="font-jakarta text-lg font-bold text-primary hover:opacity-80 transition-opacity">ShopQR</Link>
        <p className="text-sm text-on-surface-variant">© 2024 ShopQR. Empowering local businesses globally.</p>
      </div>
      <div className="flex gap-6">
        <Link href="/" className="text-on-surface-variant text-xs font-medium hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <Link href="/" className="text-on-surface-variant text-xs font-medium hover:text-primary transition-colors">
          Terms of Service
        </Link>
        <Link href="/" className="text-on-surface-variant text-xs font-medium hover:text-primary transition-colors">
          Contact Support
        </Link>
      </div>
    </footer>
  );
}
