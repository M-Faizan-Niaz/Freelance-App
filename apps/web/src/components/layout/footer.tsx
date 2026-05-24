import Link from 'next/link'

const footerLinks = {
  Services: [
    { label: 'Browse Services', href: '/services' },
    { label: 'Find Providers', href: '/providers' },
    { label: 'How It Works', href: '/#how-it-works' },
  ],
  'For Providers': [
    { label: 'Become a Provider', href: '/auth/sign-up' },
    { label: 'Provider Dashboard', href: '/provider/dashboard' },
    { label: 'Upload Portfolio', href: '/provider/portfolio' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary mb-3">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              ServeEase
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pakistan's trusted platform for on-demand home services. Verified providers, secure payments.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-sm mb-3">{section}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ServeEase. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Made with ♥ in Pakistan</p>
        </div>
      </div>
    </footer>
  )
}
