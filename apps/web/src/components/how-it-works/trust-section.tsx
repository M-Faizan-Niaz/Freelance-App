import { ShieldCheck, UserCheck, Lock, SmilePlus } from 'lucide-react';

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Background Checks',
    description:
      'Every professional on HirePro goes through a thorough background screening before they can accept jobs.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: UserCheck,
    title: 'CNIC Verification',
    description:
      'We verify each provider\'s national identity documents so you always know who is coming to your home.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Lock,
    title: 'Escrow Payments',
    description:
      'Your payment is held securely and only released to the provider after you confirm the job is complete.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: SmilePlus,
    title: 'Happiness Pledge',
    description:
      'Not satisfied? We will work to make it right — a re-do at no extra cost or a full refund. No questions asked.',
    color: 'bg-orange-50 text-orange-500',
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Why HirePro
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Built on trust, backed by safety
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Every feature is designed to give you complete peace of mind — from the first search to
            the final payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${pillar.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
