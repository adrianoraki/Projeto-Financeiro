
// Definição de tipo compartilhada entre cliente e servidor

export interface Budget {
  id: string;
  uid: string;
  name: string;
  category: string;
  limit: number;
  spent: number;
}

export interface RecurringTransaction {
  id: string;
  uid: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  lastRun: Date; // ou string, dependendo da serialização
  budgetId?: string;
}
