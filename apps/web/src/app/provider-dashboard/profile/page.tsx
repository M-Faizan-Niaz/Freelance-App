'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, ImagePlus, FileText, Upload } from 'lucide-react';
import { useUploadServiceProviderDocuments } from '@repo/api-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, getInitials } from '@/lib/utils';
import { PAKISTAN_CITIES } from '@/lib/constants';

function useSave() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  function save() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 600);
  }
  return { save, saved, loading };
}

const CATEGORY_OPTIONS = [
  'Electrician', 'Plumber', 'AC & Appliances', 'Cleaning',
  'Painting', 'Moving', 'Carpenter', 'Outdoor',
];
const EXPERIENCE_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      <Separator />
      {children}
    </section>
  );
}

export default function ProviderProfilePage() {
  const [name, setName] = useState('Ahmed Raza');
  const [phone, setPhone] = useState('300 1234567');
  const [bio, setBio] = useState('Licensed electrician with 8+ years of experience. Specialise in residential and commercial wiring, short circuit repairs, and panel upgrades.');
  const [city, setCity] = useState('Karachi');
  const [experience, setExperience] = useState('6–10 years');
  const [categories, setCategories] = useState<string[]>(['Electrician']);

  // CNIC upload state
  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const [cnicFrontFile, setCnicFrontFile] = useState<File | null>(null);
  const [cnicBackFile, setCnicBackFile] = useState<File | null>(null);
  const [cnicStatus, setCnicStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cnicError, setCnicError] = useState<string | null>(null);

  const uploadDocuments = useUploadServiceProviderDocuments();
  const info = useSave();
  const initials = getInitials(name);

  async function handleCnicUpload() {
    if (!cnicFrontFile || !cnicBackFile) return;
    setCnicStatus('idle');
    setCnicError(null);
    try {
      await uploadDocuments.mutateAsync({
        data: { cnicFront: cnicFrontFile, cnicBack: cnicBackFile },
      });
      setCnicStatus('success');
      setCnicFrontFile(null);
      setCnicBackFile(null);
    } catch (err) {
      setCnicStatus('error');
      setCnicError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    }
  }

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Provider Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your profile up to date to attract more customers.
        </p>
      </div>

      {/* Avatar */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-orange/10 text-2xl font-bold text-orange">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ImagePlus className="h-4 w-4" />
              Change Photo
            </Button>
            <p className="text-xs text-muted-foreground">JPG, PNG · Max 5MB</p>
          </div>
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Personal Information">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="p-name">Full name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-phone">Phone number</Label>
            <div className="flex gap-2">
              <span className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">+92</span>
              <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-bio">About me</Label>
            <Textarea
              id="p-bio"
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-right text-xs text-muted-foreground">{bio.length}/500</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={info.save}
          disabled={info.loading}
          className={cn(info.saved && 'bg-green-600 hover:bg-green-600')}
        >
          {info.saved ? <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Saved</span> : info.loading ? 'Saving…' : 'Save Changes'}
        </Button>
      </Section>

      {/* Professional info */}
      <Section title="Professional Details">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Service categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const checked = categories.includes(cat);
                return (
                  <label
                    key={cat}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                      checked ? 'border-orange/60 bg-orange/5 text-orange' : 'border-border text-foreground hover:border-orange/40',
                    )}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleCategory(cat)} />
                    {cat}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Years of experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Service city</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAKISTAN_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* CNIC Documents */}
      <Section title="Verification Documents">
        <p className="text-sm text-muted-foreground">
          Upload your CNIC front and back to get verified. Verified providers appear higher in search results.
        </p>

        <div className="space-y-3">
          <input
            ref={cnicFrontRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setCnicFrontFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => cnicFrontRef.current?.click()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors',
              cnicFrontFile
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            {cnicFrontFile ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Upload className="h-4 w-4 shrink-0" />
            )}
            {cnicFrontFile ? `Front: ${cnicFrontFile.name}` : 'CNIC — Front side'}
          </button>

          <input
            ref={cnicBackRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setCnicBackFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => cnicBackRef.current?.click()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors',
              cnicBackFile
                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            {cnicBackFile ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Upload className="h-4 w-4 shrink-0" />
            )}
            {cnicBackFile ? `Back: ${cnicBackFile.name}` : 'CNIC — Back side'}
          </button>
        </div>

        {cnicStatus === 'success' && (
          <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Documents uploaded. Under review within 24–48 hours.
          </p>
        )}

        {cnicStatus === 'error' && cnicError && (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {cnicError}
          </p>
        )}

        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>JPEG, PNG, WEBP, or PDF · Max 10 MB each. Your data is encrypted and never shared.</p>
        </div>

        <Button
          size="sm"
          onClick={handleCnicUpload}
          disabled={!cnicFrontFile || !cnicBackFile || uploadDocuments.isPending}
        >
          {uploadDocuments.isPending ? 'Uploading…' : 'Upload Documents'}
        </Button>
      </Section>
    </div>
  );
}
