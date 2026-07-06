import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString: string) {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
  } catch {
    return dateString
  }
}

export function formatRelative(dateString: string) {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
  } catch {
    return dateString
  }
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

// Format cents to "$X.XX"
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function maskName(firstName: string, lastName: string) {
  return `${firstName} ${lastName.charAt(0)}.`
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
