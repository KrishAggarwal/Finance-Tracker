export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  category?: string;
} 