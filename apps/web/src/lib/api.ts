import type { ListServiceCategories200DataItem } from '@repo/api-client';
import { API_BASE_URL } from '@/lib/constants';

export async function fetchCategories(): Promise<ListServiceCategories200DataItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/api/service-categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
