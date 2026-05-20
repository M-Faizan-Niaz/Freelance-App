'use client';

import { useState } from 'react';
import { CheckCircle2, ImagePlus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

/* ── Mock initial profile ────────────────────────────────────── */

const MOCK_PROFILE = {
  name: 'Faizan Niaz',
  email: 'm.faizan4905@gmail.com',
  phone: '300 1234567',
};

/* ── Section wrapper ─────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <Separator />
      {children}
    </section>
  );
}

/* ── Save feedback ───────────────────────────────────────────── */

function useSave() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function save() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  return { save, saved, loading };
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const [name, setName] = useState(MOCK_PROFILE.name);
  const [email, setEmail] = useState(MOCK_PROFILE.email);
  const [phone, setPhone] = useState(MOCK_PROFILE.phone);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [urduLang, setUrduLang] = useState(false);
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifEnRoute, setNotifEnRoute] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifSms, setNotifSms] = useState(true);

  const info = useSave();
  const pw = useSave();

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const pwMatch = !confirmPw || newPw === confirmPw;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Avatar */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ImagePlus className="h-4 w-4" />
              Change Photo
            </Button>
            <p className="text-xs text-muted-foreground">JPG, PNG or GIF · Max 5MB</p>
          </div>
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Personal Information">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <div className="flex gap-2">
              <span className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                +92
              </span>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={info.save}
            disabled={info.loading}
            className={cn(info.saved && 'bg-green-600 hover:bg-green-600')}
          >
            {info.saved ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            ) : info.loading ? (
              'Saving…'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </Section>

      {/* Change password */}
      <Section title="Change Password">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPw">Current password</Label>
            <Input
              id="currentPw"
              type="password"
              placeholder="••••••••"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPw">New password</Label>
            <Input
              id="newPw"
              type="password"
              placeholder="Min. 8 characters"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPw">Confirm new password</Label>
            <Input
              id="confirmPw"
              type="password"
              placeholder="Re-enter password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={cn(!pwMatch && 'border-destructive focus-visible:ring-destructive')}
            />
            {!pwMatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={pw.save}
          disabled={!currentPw || newPw.length < 8 || !pwMatch || pw.loading}
          className={cn(pw.saved && 'border-green-500 text-green-600')}
        >
          {pw.saved ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Password updated
            </span>
          ) : pw.loading ? (
            'Updating…'
          ) : (
            'Update Password'
          )}
        </Button>
      </Section>

      {/* Language preference */}
      <Section title="Language">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Urdu interface</p>
            <p className="text-xs text-muted-foreground">Switch app language to اردو</p>
          </div>
          <Switch checked={urduLang} onCheckedChange={setUrduLang} />
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[
          {
            label: 'Booking confirmations',
            desc: 'When a booking is confirmed or updated',
            value: notifBooking,
            set: setNotifBooking,
          },
          {
            label: 'Provider en route alerts',
            desc: 'When your provider is heading to you',
            value: notifEnRoute,
            set: setNotifEnRoute,
          },
          {
            label: 'SMS notifications',
            desc: 'Receive updates via SMS to your phone',
            value: notifSms,
            set: setNotifSms,
          },
          {
            label: 'Promotions & offers',
            desc: 'Discounts, seasonal deals, and platform news',
            value: notifPromo,
            set: setNotifPromo,
          },
        ].map(({ label, desc, value, set }) => (
          <div key={label} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Switch checked={value} onCheckedChange={set} />
          </div>
        ))}
      </Section>
    </div>
  );
}
