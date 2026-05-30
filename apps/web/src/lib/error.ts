export function getApiError(e: unknown, fallback: string): string {
  return (e as { data?: { message?: string } })?.data?.message ?? fallback
}
