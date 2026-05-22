'use client';

import { useRef, useState } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUploadProfilePhoto } from '@repo/api-client';
import { useUpdateServiceProviderProfile } from '@repo/api-client';

interface StepProfileProps {
  onNext: () => void;
}

export function StepProfile({ onNext }: StepProfileProps) {
  const [bio, setBio] = useState('');
  const [bioError, setBioError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [apiError, setApiError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPhoto = useUploadProfilePhoto();
  const updateProfile = useUpdateServiceProviderProfile();

  const isLoading = uploadPhoto.isPending || updateProfile.isPending;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleNext() {
    setApiError('');
    setBioError('');

    if (!bio.trim()) {
      setBioError('Please write a short bio so customers know who you are.');
      return;
    }

    try {
      if (photoFile) {
        await uploadPhoto.mutateAsync({ data: { photo: photoFile } });
      }
      await updateProfile.mutateAsync({ data: { bio: bio.trim() } });
      onNext();
    } catch {
      setApiError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Build your profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A great photo and bio help customers choose you with confidence.
        </p>
      </div>

      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={photoPreview ?? ''} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {photoPreview ? '' : '?'}
            </AvatarFallback>
          </Avatar>
          {photoFile && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1">
              <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
          {photoFile ? 'Change photo' : 'Upload photo'}
        </Button>
        <p className="text-xs text-muted-foreground">Optional — you can add this later</p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">About you</Label>
        <Textarea
          id="bio"
          placeholder="e.g. Experienced plumber with 5+ years fixing leaks, pipes, and installations across Karachi. Fast, reliable, and always on time."
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={cn(
            'resize-none',
            bioError && 'border-destructive focus-visible:ring-destructive',
          )}
          maxLength={1000}
        />
        <div className="flex items-center justify-between">
          {bioError ? (
            <p className="text-xs text-destructive">{bioError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Tell customers what you do and why they should hire you.
            </p>
          )}
          <span className="text-xs text-muted-foreground">{bio.length}/1000</span>
        </div>
      </div>

      {apiError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {apiError}
        </p>
      )}

      <Button className="w-full" size="lg" onClick={handleNext} disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  );
}
