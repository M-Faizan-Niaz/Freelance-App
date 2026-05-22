'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useListServiceCategories, useSetServiceProviderCategories } from '@repo/api-client';

interface StepCategoriesProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepCategories({ onNext, onBack }: StepCategoriesProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectionError, setSelectionError] = useState('');
  const [apiError, setApiError] = useState('');

  const { data: categoriesData, isPending: loadingCategories } = useListServiceCategories();
  const categories = categoriesData?.data ?? [];

  const setCategories = useSetServiceProviderCategories();

  function toggle(id: number) {
    setSelectionError('');
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleNext() {
    setApiError('');
    if (selected.length === 0) {
      setSelectionError('Please select at least one service category.');
      return;
    }
    try {
      await setCategories.mutateAsync({ data: { categoryIds: selected } });
      onNext();
    } catch {
      setApiError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">What services do you offer?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select all that apply. This helps us match you with the right jobs.
        </p>
      </div>

      {loadingCategories ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border bg-muted"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-foreground hover:border-primary/50',
                )}
              >
                {isSelected && (
                  <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-primary" />
                )}
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                    🔧
                  </div>
                )}
                <span className="text-xs font-medium leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {selectionError && (
        <p className="text-xs text-destructive">{selectionError}</p>
      )}

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
        </p>
      )}

      {apiError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {apiError}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={setCategories.isPending}
        >
          Back
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={handleNext}
          disabled={setCategories.isPending || loadingCategories}
        >
          {setCategories.isPending ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
