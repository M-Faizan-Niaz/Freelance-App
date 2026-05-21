import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NEXT_STEPS = [
  'Our team reviews your CNIC and documents',
  'You receive an SMS with your verification status',
  'Your profile goes live and you start receiving job requests',
];

export function Confirmation() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-12 w-12 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
        <p className="text-sm text-muted-foreground">
          Your application is under review. Our team will verify your documents within 24–48 hours.
        </p>
      </div>

      <div className="w-full rounded-xl border bg-card px-5 py-4 text-left space-y-2 text-sm">
        <p className="font-semibold text-foreground">What happens next?</p>
        <ol className="space-y-1.5 text-muted-foreground list-none">
          {NEXT_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button className="w-full" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/sign-in">Sign in to your account</Link>
        </Button>
      </div>
    </div>
  );
}
