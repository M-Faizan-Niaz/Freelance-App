import { Zap, Droplets, Wind, Sparkles, Brush, Truck, Hammer, Trees } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  electrician:      Zap,
  plumber:          Droplets,
  'ac-appliances':  Wind,
  cleaning:         Sparkles,
  painting:         Brush,
  moving:           Truck,
  carpenter:        Hammer,
  outdoor:          Trees,
};

export const COLOR_MAP: Record<string, string> = {
  electrician:      'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100',
  plumber:          'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  'ac-appliances':  'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  cleaning:         'bg-green-50 text-green-600 group-hover:bg-green-100',
  painting:         'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  moving:           'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  carpenter:        'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  outdoor:          'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
};
