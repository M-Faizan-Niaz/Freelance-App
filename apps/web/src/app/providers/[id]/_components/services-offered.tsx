import { CheckCircle } from 'lucide-react';
import type { ProviderProfile } from '@/app/providers/_data/provider-profiles';

interface ServicesOfferedProps {
  provider: ProviderProfile;
}

export function ServicesOffered({ provider }: ServicesOfferedProps) {
  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-foreground">Services Offered</h2>
      </div>
      <ul className="divide-y">
        {provider.servicesOffered.map((service) => (
          <li
            key={service.label}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <span className="flex items-center gap-2.5 text-sm text-foreground">
              <CheckCircle className="h-4 w-4 shrink-0 text-success" />
              {service.label}
            </span>
            <span className="text-sm font-semibold text-orange">
              ₨{service.price.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
