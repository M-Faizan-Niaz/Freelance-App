'use client';

import { useState } from 'react';
import { MapPin, Trash2, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];

interface Address {
  id: string;
  street: string;
  area: string;
  city: string;
  unit: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    street: '45 Bahadurabad',
    area: 'Gulshan-e-Iqbal',
    city: 'Karachi',
    unit: 'Flat 3, Floor 2',
    isDefault: true,
  },
  {
    id: 'addr-2',
    street: '8 Defence Phase 5',
    area: 'DHA',
    city: 'Karachi',
    unit: '',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Karachi');
  const [unit, setUnit] = useState('');

  function addAddress() {
    if (!street.trim() || !area.trim()) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      street,
      area,
      city,
      unit,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setStreet('');
    setArea('');
    setCity('Karachi');
    setUnit('');
    setShowForm(false);
  }

  function deleteAddress(id: string) {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  }

  function setDefault(id: string) {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage addresses used for your bookings.
          </p>
        </div>
        {!showForm && (
          <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="No saved addresses"
          description="Add an address to speed up your booking process."
          action={{ label: 'Add Address', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                'rounded-xl border bg-card p-4 shadow-sm',
                addr.isDefault && 'border-primary/40 bg-primary/5',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {addr.street}
                        {addr.unit && `, ${addr.unit}`}
                      </p>
                      {addr.isDefault && (
                        <Badge variant="default" className="text-[10px] py-0">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {addr.area}, {addr.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefault(addr.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      title="Set as default"
                    >
                      <Star className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Default</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr.id)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Delete address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add address form */}
      {showForm && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-foreground">New Address</h2>
          <Separator />
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="new-street">Street address</Label>
              <Input
                id="new-street"
                placeholder="e.g. 45 Bahadurabad"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-area">Area / Neighbourhood</Label>
              <Input
                id="new-area"
                placeholder="e.g. Gulshan-e-Iqbal"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-city">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="new-city">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-unit">
                Floor / Unit{' '}
                <span className="font-normal text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="new-unit"
                placeholder="e.g. Flat 3, Floor 2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!street.trim() || !area.trim()}
              onClick={addAddress}
            >
              Save Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
