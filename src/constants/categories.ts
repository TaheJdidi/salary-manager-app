export const FIXED_CATEGORIES = [
  { key: 'rent', label: 'Rent / Mortgage', icon: 'home' },
  { key: 'internet', label: 'Internet', icon: 'wifi' },
  { key: 'bills', label: 'Utilities / Bills', icon: 'flash' },
  { key: 'subscription', label: 'Subscriptions', icon: 'repeat' },
  { key: 'custom', label: 'Other', icon: 'ellipsis-horizontal' },
] as const;

export const PRIORITIES = [
  { key: 'high', label: 'High', color: '#22C55E' },   // essential
  { key: 'medium', label: 'Medium', color: '#F59E0B' },
  { key: 'low', label: 'Low', color: '#EF4444' },      // discretionary — flagged so it stands out
] as const;

export const VARIABLE_CATEGORIES = [
  { key: 'groceries', label: 'Groceries', icon: 'cart' },
  { key: 'dining', label: 'Dining Out', icon: 'restaurant' },
  { key: 'transport', label: 'Transport', icon: 'car' },
  { key: 'entertainment', label: 'Entertainment', icon: 'film' },
  { key: 'trips', label: 'Trips / Travel', icon: 'airplane' },
  { key: 'health', label: 'Health', icon: 'medkit' },
  { key: 'custom', label: 'Other', icon: 'ellipsis-horizontal' },
] as const;
