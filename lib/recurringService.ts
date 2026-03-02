
import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { addTransaction } from './transactionService';

const RECURRING_COLLECTION = 'recurringTransactions';

// Adicionar uma nova transação recorrente
export const addRecurringTransaction = async (recurringTransaction: any) => {
  try {
    await addDoc(collection(db, RECURRING_COLLECTION), { ...recurringTransaction, lastRun: new Date() });
  } catch (error) {
    console.error("Erro ao adicionar transação recorrente: ", error);
    throw new Error('Não foi possível adicionar a transação recorrente.');
  }
};

// Buscar todas as transações recorrentes de um usuário
export const getRecurringTransactions = async (uid: string) => {
  try {
    const q = query(collection(db, RECURRING_COLLECTION), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const recurring: any[] = [];
    querySnapshot.forEach((doc) => {
      recurring.push({ id: doc.id, ...doc.data() });
    });
    return recurring;
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
    let nextRun = new Date(recurring.lastRun.seconds * 1000);
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
      await addTransaction({
        uid,
        description: recurring.description,
        amount: recurring.amount,
        type: recurring.type,
        category: recurring.category, // Adicionando a categoria que faltava
        date: new Date().toISOString().split('T')[0],
        budgetId: recurring.budgetId,
      });
      await updateLastRun(recurring.id, new Date());
    }
  }
};
