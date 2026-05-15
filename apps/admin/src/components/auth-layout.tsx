import { Outlet } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

export function AuthLayout() {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        {/* Brand panel — right side on desktop, hidden on mobile */}
        <div className="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
          <div className="absolute top-10 space-y-1 px-10 text-primary-foreground">
            <ShieldCheck className="size-10" />
            <h1 className="text-2xl font-medium">Admin Panel</h1>
            <p className="text-sm">Manage your application with ease.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Secure Access</h2>
              <p className="text-sm">
                Your data is protected with industry-standard encryption and authentication.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Need help?</h2>
              <p className="text-sm">
                Contact your system administrator for account issues or access requests.
              </p>
            </div>
          </div>
        </div>

        {/* Form area — left side */}
        <div className="relative order-1 flex h-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
