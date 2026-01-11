
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  installmentAmount: number;
  nextPaymentDate: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'SHORT' | 'LONG'; // SHORT: 1 year, LONG: 2-3 years
}

export interface UserFinance {
  bankBalance: number;
  transactions: Transaction[];
  loans: Loan[];
  goals: Goal[];
}
