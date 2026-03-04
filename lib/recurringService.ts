
import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { addTransaction, TransactionFormInput } from './transactionService';

const RECURRING_COLLECTION = 'recurringTransactions';

// Interface para uma transação recorrente
export interface RecurringTransaction {
  id: string;
  uid: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string; // This is the old field, used for fallback
  frequency: 'Diária' | 'Semanal' | 'Mensal';
  lastRun: Timestamp;
  budgetId?: string; // This seems to be unused now by addTransaction
}

// Tipo para a entrada de uma nova transação recorrente
type RecurringTransactionInput = Omit<RecurringTransaction, 'id' | 'lastRun'>;

// Adicionar uma nova transação recorrente
export const addRecurringTransaction = async (recurringTransaction: RecurringTransactionInput) => {
  try {
    await addDoc(collection(db, RECURRING_COLLECTION), { ...recurringTransaction, lastRun: new Date() });
  } catch (error) {
    console.error("Erro ao adicionar transação recorrente: ", error);
    throw new Error('Não foi possível adicionar a transação recorrente.');
  }
};

// Buscar todas as transações recorrentes de um usuário
export const getRecurringTransactions = async (uid: string): Promise<RecurringTransaction[]> => {
  try {
    const q = query(collection(db, RECURRING_COLLECTION), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as RecurringTransaction));
  } catch (error) {
    console.error("Erro ao buscar transações recorrentes: ", error);
    return [];
  }
};

// Atualizar a data da última execução de uma transação recorrente
export const updateLastRun = async (id: string, lastRun: Date) => {
  try {
    const recurringDoc = doc(db, RECURRING_COLLECTION, id);
    await updateDoc(recurringDoc, { lastRun });
  } catch (error) {
    console.error("Erro ao atualizar a última execução: ", error);
  }
};

// Processar transações recorrentes
export const processRecurringTransactions = async (uid: string) => {
  const recurringTransactions = await getRecurringTransactions(uid);
  const now = new Date();

  for (const recurring of recurringTransactions) {
    let nextRun = recurring.lastRun.toDate();
    let shouldRun = false;

    while (nextRun <= now) {
      shouldRun = true;
      switch (recurring.frequency) {
        case 'Diária':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'Semanal':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'Mensal':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }
    }

    if (shouldRun) {
      const transactionData: TransactionFormInput = {
        uid,
        description: recurring.description,
        amount: recurring.amount,
        type: recurring.type,
        group: recurring.category, // Use old category as group
        subGroup: 'Recorrente',    // Add placeholder for subGroup
        date: new Date().toISOString().split('T')[0],
      };

      await addTransaction(transactionData);
      await updateLastRun(recurring.id, new Date());
    }
  }
};
