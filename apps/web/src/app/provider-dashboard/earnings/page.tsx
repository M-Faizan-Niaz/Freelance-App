'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Percent, Wallet, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EarningsChart } from '@/components/provider-dashboard/earnings-chart';
import { MOCK_JOBS, WEEKLY_EARNINGS } from '../_data/mock-jobs';

const MONTHLY_EARNINGS = [
  { day: 'W1', amount: 18500 },
  { day: 'W2', amount: 24000 },
  { day: 'W3', amount: 15800 },
  { day: 'W4', amount: 26300 },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const completed = MOCK_JOBS.filter((j) => j.status === 'completed');
  const grossTotal = completed.reduce((s, j) => s + j.grossAmount, 0);
  const commissionTotal = completed.reduce((s, j) => s + j.commission, 0);
  const netTotal = grossTotal - commissionTotal;

  const weekGross = WEEKLY_EARNINGS.reduce((s, d) => s + d.amount, 0);
  const chartData = period === 'week' ? WEEKLY_EARNINGS : MONTHLY_EARNINGS;
  const chartTotal = chartData.reduce((s, d) => s + d.amount, 0);

  const summaryCards = [
    {
      icon: DollarSign,
      label: 'Gross Earnings',
      value: `₨${grossTotal.toLocaleString()}`,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Percent,
      label: 'Platform Commission',
      value: `− ₨${commissionTotal.toLocaleString()}`,
      color: 'text-red-600 bg-red-100 dark:bg-red-950/40',
    },
    {
      icon: TrendingUp,
      label: 'Net Payout',
      value: `₨${netTotal.toLocaleString()}`,
      color: 'text-green-600 bg-green-100 dark:bg-green-950/40',
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your income and payouts.</p>
      </div>

      {/* Total header */}
      <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-green-100">Total Net Earnings</p>
        <p className="mt-1 text-4xl font-extrabold">₨{netTotal.toLocaleString()}</p>
        <p className="mt-1 text-sm text-green-200">from {completed.length} completed jobs</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {summaryCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-3 shadow-sm text-center">
            <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Earnings Chart</h2>
            <p className="text-sm text-muted-foreground">₨{chartTotal.toLocaleString()} this {period}</p>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <EarningsChart data={chartData} />
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-foreground">Recent Transactions</h2>
        <Separator />
        <div className="divide-y">
          {completed.map((job) => (
            <div key={job.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{job.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.customerName} ·{' '}
                    {new Date(job.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  ₨{(job.grossAmount - job.commission).toLocaleString()}
                </p>
                <Badge variant="success" className="text-[10px] py-0">Paid</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout section */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-foreground">Payout</h2>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available balance</p>
              <p className="text-xl font-extrabold text-foreground">₨{netTotal.toLocaleString()}</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">Request Payout</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Payouts are processed within 1–2 business days to your registered JazzCash / EasyPaisa account.
        </p>
      </div>
    </div>
  );
}
