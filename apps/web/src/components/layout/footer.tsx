import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DISCOVER = [
  { label: 'Browse Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Cities', href: '/cities' },
  { label: 'Cost Guides', href: '/cost-guides' },
];

const COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Press', href: '/press' },
  { label: 'Partnerships', href: '/partnerships' },
];

const SUPPORT = [
  { label: 'Help Center', href: '/help' },
  { label: 'Safety', href: '/safety' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
                H
              </div>
              <span className="text-background">HirePro</span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              Pakistan&apos;s trusted platform for on-demand home services. Verified professionals,
              secure payments.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              {/* TikTok icon (lucide doesn't have it, using custom SVG) */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-background/60 hover:text-background transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-background">Discover</h4>
            <ul className="space-y-2">
              {DISCOVER.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-background">Company</h4>
            <ul className="space-y-2">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-background">Support</h4>
            <ul className="space-y-2">
              {SUPPORT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Store Badges */}
            <div className="pt-2 space-y-2">
              <p className="text-xs text-background/40 uppercase tracking-wide font-semibold">
                Get the app
              </p>
              <div className="flex flex-col gap-2">
                <AppStoreBadge store="apple" />
                <AppStoreBadge store="google" />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <p>© {new Date().getFullYear()} HirePro. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Language:</span>
            <button className="hover:text-background transition-colors px-1">English</button>
            <span>/</span>
            <button className="hover:text-background transition-colors px-1 font-noto-nastaliq">
              اردو
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppStoreBadge({ store }: { store: 'apple' | 'google' }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-background/20 bg-background/5 px-3 py-1.5 hover:bg-background/10 transition-colors cursor-pointer">
      {store === 'apple' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-background" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-background" aria-hidden>
          <path d="M3.18 23.76c.3.17.64.24.99.19l12.4-12.4-2.53-2.53L3.18 23.76zM20.47 10.7L17.6 9.08l-2.85 2.85 2.85 2.85 2.89-1.63c.82-.46.82-1.99-.02-2.45zM2.01 1.05C1.86 1.3 1.77 1.61 1.77 1.97v20.06c0 .36.09.67.24.92l.12.12 11.24-11.24v-.27L2.13.93l-.12.12zM13.37 12.5l3.04-3.04-2.53-2.53L2.15 19.14l11.22-6.64z" />
        </svg>
      )}
      <div>
        <p className="text-background/40 text-[10px] leading-tight">
          {store === 'apple' ? 'Download on the' : 'Get it on'}
        </p>
        <p className="text-background text-xs font-semibold leading-tight">
          {store === 'apple' ? 'App Store' : 'Google Play'}
        </p>
      </div>
    </div>
  );
}
