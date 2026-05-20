import { Smartphone } from 'lucide-react';

export function AppDownloadBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-700">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          {/* Text */}
          <div className="text-center lg:text-left max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-yellow-300">
              Mobile App
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Take us with you
            </h2>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">
              Book services, track your provider in real time, and chat — all from the HirePro
              mobile app. Available for iOS and Android.
            </p>

            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
              <AppBadge store="apple" />
              <AppBadge store="google" />
            </div>
          </div>

          {/* Phone mockup illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-64 w-32 rounded-[2rem] bg-white/10 border-2 border-white/20 shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-center pt-4 pb-2">
                <div className="h-1 w-10 rounded-full bg-white/30" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <p className="text-[10px] font-semibold text-white/80 text-center">HirePro</p>
                <div className="w-full space-y-1.5 mt-2">
                  {[80, 60, 70, 50].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-white/20" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-center pb-3">
                <div className="h-1 w-8 rounded-full bg-white/30" />
              </div>
            </div>
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl scale-150 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AppBadge({ store }: { store: 'apple' | 'google' }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 hover:bg-white/20 transition-colors cursor-pointer">
      {store === 'apple' ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
          <path d="M3.18 23.76c.3.17.64.24.99.19l12.4-12.4-2.53-2.53L3.18 23.76zM20.47 10.7L17.6 9.08l-2.85 2.85 2.85 2.85 2.89-1.63c.82-.46.82-1.99-.02-2.45zM2.01 1.05C1.86 1.3 1.77 1.61 1.77 1.97v20.06c0 .36.09.67.24.92l.12.12 11.24-11.24v-.27L2.13.93l-.12.12zM13.37 12.5l3.04-3.04-2.53-2.53L2.15 19.14l11.22-6.64z" />
        </svg>
      )}
      <div>
        <p className="text-white/60 text-[10px] leading-none">
          {store === 'apple' ? 'Download on the' : 'Get it on'}
        </p>
        <p className="text-white text-sm font-semibold leading-tight mt-0.5">
          {store === 'apple' ? 'App Store' : 'Google Play'}
        </p>
      </div>
    </div>
  );
}
