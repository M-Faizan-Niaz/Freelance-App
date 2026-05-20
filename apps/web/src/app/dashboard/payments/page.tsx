import type { Metadata } from 'next';
import { CreditCard, Smartphone, Plus, ArrowDownLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MOCK_BOOKINGS } from '../_data/mock-bookings';

export const metadata: Metadata = { title: 'Payments — HirePro' };

const PAYMENT_METHODS = [
  {
    id: 'pm-1',
    type: 'jazzcash',
    label: 'JazzCash',
    detail: '0300 •••• 4567',
    icon: Smartphone,
    color: 'text-red-600 bg-red-100 dark:bg-red-950/40',
  },
  {
    id: 'pm-2',
    type: 'easypaisa',
    label: 'EasyPaisa',
    detail: '0312 •••• 8821',
    icon: Smartphone,
    color: 'text-green-600 bg-green-100 dark:bg-green-950/40',
  },
  {
    id: 'pm-3',
    type: 'card',
    label: 'Visa',
    detail: '•••• •••• •••• 4242',
    icon: CreditCard,
    color: 'text-primary bg-primary/10',
  },
];

const transactions = MOCK_BOOKINGS.filter((b) => b.status === 'completed').map((b) => ({
  id: b.id,
  date: b.date,
  service: b.service,
  provider: b.providerName,
  amount: b.price + b.platformFee,
  status: 'Paid',
}));

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage payment methods and view your transaction history.
        </p>
      </div>

      {/* Payment methods */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Payment Methods</h2>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Method
          </Button>
        </div>
        <Separator />
        <div className="space-y-3">
          {PAYMENT_METHODS.map((pm) => {
            const Icon = pm.icon;
            return (
              <div
                key={pm.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${pm.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{pm.label}</p>
                    <p className="text-xs text-muted-foreground">{pm.detail}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          All payments are processed through secure escrow. Funds are released to providers only after job completion.
        </p>
      </section>

      {/* Transaction history */}
      <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-foreground">Transaction History</h2>
        <Separator />

        {transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="space-y-0 divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.provider} ·{' '}
                      {new Date(tx.date).toLocaleDateString('en-PK', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ₨{tx.amount.toLocaleString()}
                  </p>
                  <Badge variant="success" className="text-[10px] py-0">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
