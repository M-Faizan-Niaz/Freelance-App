'use client';

import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StepDone() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Rocket className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">You&apos;re all set!</h2>
        <p className="text-sm text-muted-foreground">
          Your profile is ready. Once our team verifies your account, you&apos;ll start receiving job requests.
        </p>
      </div>

      <div className="w-full rounded-xl border bg-card px-5 py-4 text-left space-y-2 text-sm">
        <p className="font-semibold text-foreground">While you wait</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
            Upload your CNIC photos from your dashboard to speed up verification
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
            Add portfolio photos to showcase your past work
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
            You&apos;ll get an SMS when you&apos;re approved and ready to take jobs
          </li>
        </ul>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => router.push('/provider-dashboard')}
      >
        Go to my dashboard
      </Button>
    </div>
  );
}
