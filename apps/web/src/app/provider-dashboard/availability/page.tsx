'use client';

import { useState } from 'react';
import { CheckCircle2, PalmtreeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const SLOTS = [
  { id: 'Morning', label: 'Morning', hours: '6 am – 12 pm' },
  { id: 'Afternoon', label: 'Afternoon', hours: '12 pm – 6 pm' },
  { id: 'Evening', label: 'Evening', hours: '6 pm – 10 pm' },
] as const;

type AvailKey = `${typeof DAYS[number]}-${typeof SLOTS[number]['id']}`;

function buildDefault(): Record<AvailKey, boolean> {
  const rec: Partial<Record<AvailKey, boolean>> = {};
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      const key = `${day}-${slot.id}` as AvailKey;
      rec[key] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day) && slot.id !== 'Evening';
    }
  }
  return rec as Record<AvailKey, boolean>;
}

function useSave() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  function save() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 600);
  }
  return { save, saved, loading };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <Separator />
      {children}
    </section>
  );
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Record<AvailKey, boolean>>(buildDefault);
  const [vacationMode, setVacationMode] = useState(false);
  const [vacationFrom, setVacationFrom] = useState('');
  const [vacationUntil, setVacationUntil] = useState('');

  const schedule = useSave();
  const vacation = useSave();

  function toggle(key: AvailKey) {
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setRow(slotId: typeof SLOTS[number]['id'], value: boolean) {
    setAvailability((prev) => {
      const next = { ...prev };
      for (const day of DAYS) {
        next[`${day}-${slotId}` as AvailKey] = value;
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Availability</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set your working hours so customers know when you&apos;re available.
        </p>
      </div>

      {/* Weekly grid */}
      <Section title="Weekly Schedule">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-28 py-2 text-left text-xs font-medium text-muted-foreground" />
                {DAYS.map((day) => (
                  <th key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </th>
                ))}
                <th className="w-24 py-2" />
              </tr>
            </thead>
            <tbody className="space-y-2">
              {SLOTS.map((slot) => (
                <tr key={slot.id} className="border-t border-border/50">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-foreground">{slot.label}</p>
                    <p className="text-xs text-muted-foreground">{slot.hours}</p>
                  </td>
                  {DAYS.map((day) => {
                    const key = `${day}-${slot.id}` as AvailKey;
                    const active = availability[key];
                    return (
                      <td key={day} className="py-3 text-center">
                        <button
                          onClick={() => toggle(key)}
                          className={cn(
                            'mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                            active
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/70',
                          )}
                          aria-pressed={active}
                          title={`${day} ${slot.label}`}
                        >
                          {active ? '✓' : '—'}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 pl-3">
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => setRow(slot.id, true)}
                        className="text-xs text-primary hover:underline"
                      >
                        All
                      </button>
                      <button
                        onClick={() => setRow(slot.id, false)}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          size="sm"
          onClick={schedule.save}
          disabled={schedule.loading}
          className={cn(schedule.saved && 'bg-green-600 hover:bg-green-600')}
        >
          {schedule.saved
            ? <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Saved</span>
            : schedule.loading ? 'Saving…' : 'Save Schedule'}
        </Button>
      </Section>

      {/* Vacation mode */}
      <Section title="Vacation Mode">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <PalmtreeIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Enable vacation mode</p>
              <p className="text-xs text-muted-foreground">Pause all incoming job requests</p>
            </div>
          </div>
          {/* Pill toggle */}
          <button
            role="switch"
            aria-checked={vacationMode}
            onClick={() => setVacationMode((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
              vacationMode ? 'bg-primary' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
                vacationMode ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </button>
        </div>

        {vacationMode && (
          <div className="space-y-4">
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700/50 dark:bg-yellow-950/30 dark:text-yellow-300">
              While on vacation, your profile will be hidden from search results and you won&apos;t receive job requests.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vac-from">From</Label>
                <input
                  id="vac-from"
                  type="date"
                  value={vacationFrom}
                  onChange={(e) => setVacationFrom(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vac-until">Until</Label>
                <input
                  id="vac-until"
                  type="date"
                  value={vacationUntil}
                  min={vacationFrom}
                  onChange={(e) => setVacationUntil(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        <Button
          size="sm"
          onClick={vacation.save}
          disabled={vacation.loading}
          className={cn(vacation.saved && 'bg-green-600 hover:bg-green-600')}
        >
          {vacation.saved
            ? <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Saved</span>
            : vacation.loading ? 'Saving…' : 'Save Vacation Settings'}
        </Button>
      </Section>
    </div>
  );
}
