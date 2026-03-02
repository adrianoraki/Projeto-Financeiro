
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { updateBudgetSpent } from './budgetService';

const TRANSACTIONS_COLLECTION = 'transactions';

// Interface atualizada para incluir campos de parcelamento
interface Transaction {
  uid: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  budgetId?: string | null;
  installmentNumber?: number; // Número da parcela atual
  totalInstallments?: number; // Total de parcelas
  totalAmount?: number; // Valor total da compra parcelada
}

export const addTransaction = async (transaction: Transaction) => {
  try {
    // Adicionar a transação ao Firestore
    await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transaction,
      createdAt: new Date(),
    });

    // Se for uma despesa associada a um orçamento, atualiza o valor gasto
    if (transaction.type === 'expense' && transaction.budgetId) {
      await updateBudgetSpent(transaction.budgetId, transaction.amount);
    }
  } catch (error) {
    console.error("Erro ao adicionar transação: ", error);
    throw new Error('Não foi possível adicionar a transação.');
  }
};
