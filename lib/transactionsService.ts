
import { collection, addDoc, getDocs, query, where, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { getCards } from './cardsService'; // Importa a função para buscar os cartões

export interface Transaction {
  id?: string;
  uid: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string | Timestamp; 
  category: string;
  paymentMethod: string;
  installments?: number;
  createdAt: Timestamp;
}

// Função para adicionar uma nova transação
export const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
  const { uid, description, amount, type, date, category, paymentMethod, installments } = transactionData;
  const batch = writeBatch(db);

  // Lógica de parcelamento para cartão de crédito
  if (paymentMethod === 'Cartão de Crédito' && installments && installments > 1) {
    // 1. Buscar os cartões do usuário
    const userCards = await getCards(uid);
    // 2. Definir o dia do vencimento (usar o do primeiro cartão ou um padrão)
    const invoiceDueDate = userCards.length > 0 ? userCards[0].invoiceDueDate : 10; // Padrão: dia 10

    const purchaseDate = new Date(date as string);
    const monthlyAmount = amount / installments;

    // 3. Calcular a data da primeira parcela para o mês seguinte
    let firstInstallmentDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + 1, invoiceDueDate);

    for (let i = 0; i < installments; i++) {
      const installmentDate = new Date(firstInstallmentDate);
      installmentDate.setMonth(firstInstallmentDate.getMonth() + i);

      const newTransactionRef = doc(collection(db, 'transactions'));
      batch.set(newTransactionRef, {
        uid,
        description: `${description} (${i + 1}/${installments})`,
        amount: monthlyAmount,
        type,
        date: Timestamp.fromDate(installmentDate),
        category,
        paymentMethod,
        installments: 1,
        createdAt: Timestamp.now(),
      });
    }
  } else {
    // Lógica para transação única ou outros métodos
    const newTransactionRef = doc(collection(db, 'transactions'));
    batch.set(newTransactionRef, {
        ...transactionData,
        date: Timestamp.fromDate(new Date(date as string)),
        createdAt: Timestamp.now(),
    });
  }
  
  await batch.commit();
};


// Função para buscar todas as transações de um usuário
export const getTransactions = async (uid: string): Promise<Transaction[]> => {
  const q = query(collection(db, "transactions"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const transactions: Transaction[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Transaction;
    transactions.push({ 
        ...data, 
        id: doc.id, 
        date: (data.date as Timestamp).toDate().toISOString().split('T')[0]
    });
  });
  return transactions;
};
