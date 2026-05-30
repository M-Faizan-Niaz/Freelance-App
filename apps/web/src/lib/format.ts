export function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
}

export function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrencyPKR(amount: string | number) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
