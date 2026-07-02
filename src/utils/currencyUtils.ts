export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatCurrency(cents: number, symbol = '$'): string {
  return `${symbol}${fromCents(cents).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats cents for an editable text field: no trailing ".00" clutter.
 * 1000 -> "10", 1050 -> "10.5", 1055 -> "10.55", 0 -> "".
 */
export function centsToInputValue(cents: number): string {
  if (!cents) return '';
  return String(Number((cents / 100).toFixed(2)));
}

/**
 * Parses a user-typed amount, accepting both "." and "," decimal separators.
 * Returns NaN for empty/invalid input.
 */
export function parseAmount(text: string): number {
  return parseFloat(text.replace(',', '.'));
}

/**
 * Normalizes raw text input from a numeric keyboard into a clean decimal string:
 * converts "," to ".", strips non-numeric chars, keeps a single dot, max 2 decimals.
 */
export function normalizeAmountInput(text: string): string {
  let cleaned = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
  }
  const parts = cleaned.split('.');
  return parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : cleaned;
}
