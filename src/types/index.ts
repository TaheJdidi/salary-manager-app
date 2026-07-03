export type FixedCategory = 'rent' | 'internet' | 'bills' | 'subscription' | 'custom';
export type VariableCategory =
  | 'groceries'
  | 'dining'
  | 'transport'
  | 'entertainment'
  | 'trips'
  | 'health'
  | 'custom';

export type Priority = 'high' | 'medium' | 'low';

export interface Income {
  id: number;
  monthlySalary: number; // cents
  otherIncome: number;   // cents
  updatedAt: string;
}

export interface FixedExpense {
  id: number;
  name: string;
  category: FixedCategory;
  amount: number; // cents
  isActive: boolean;
  createdAt: string;
}

export interface FixedExpensePayment {
  id: number;
  fixedExpenseId: number;
  monthKey: string; // YYYY-MM
  isPaid: boolean;
  paidAt: string | null;
}

export interface FixedExpenseWithPayment extends FixedExpense {
  isPaid: boolean;
  paymentId: number | null;
  paidAt: string | null;
}

export interface VariableExpense {
  id: number;
  amount: number; // cents
  category: VariableCategory;
  priority: Priority;
  date: string;     // YYYY-MM-DD
  monthKey: string; // YYYY-MM
  note: string | null;
  createdAt: string;
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;  // cents
  currentAmount: number; // cents
  deadline: string | null; // YYYY-MM-DD
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsContribution {
  id: number;
  goalId: number | null;
  amount: number; // cents
  monthKey: string;
  note: string | null;
  createdAt: string;
}

export interface MonthlySnapshot {
  monthKey: string;
  totalIncome: number;
  fixedExpenseTotal: number;
  variableExpenseTotal: number;
  savingsTarget: number;
  remainingBalance: number;
  updatedAt: string;
}

export interface DashboardData {
  totalIncome: number;
  fixedTotal: number;
  variableTotal: number;
  savingsTarget: number;
  remaining: number;
  alertThreshold: number;
  isUnderAlert: boolean;
}
