
import { collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Interface para os dados que chegam do formulário
export interface TransactionFormInput {
    uid: string;
    description: string;
    amount: number | string;
    date: string; // Date as 'YYYY-MM-DD' string
    type: 'income' | 'expense';
    group: string;
    subGroup: string;
    cardId?: string;
    budgetId?: string;
}

// Interface base da transação, refletindo a flexibilidade dos tipos
export interface Transaction {
    id: string;
    uid: string;
    description: string;
    amount: number;
    date: Timestamp | string; // Permite Timestamp do Firestore ou string no formulário
    type: 'income' | 'expense';
    category: string;
    paymentMethod: string;
    status?: 'paid' | 'pending';
    createdAt: Timestamp;
    cardId?: string;
}

// Tipo específico para a aplicação com a data formatada como string
export type AppTransaction = Omit<Transaction, 'date'> & {
    date: string;
};

/**
 * Adiciona uma nova transação ao Firestore.
 */
export const addTransaction = async (transactionData: TransactionFormInput): Promise<Transaction> => {
    if (!transactionData.uid) {
        throw new Error("UID do usuário é obrigatório para adicionar transação.");
    }

    const category = transactionData.group || 'Geral';
    const paymentMethod = transactionData.subGroup || (transactionData.type === 'income' ? 'N/A' : 'Não especificado');

    const newTransactionData: Omit<Transaction, 'id'> = {
        uid: transactionData.uid,
        description: transactionData.description,
        amount: parseFloat(String(transactionData.amount)),
        date: Timestamp.fromDate(new Date(transactionData.date + 'T00:00:00')),
        type: transactionData.type,
        category: category,
        paymentMethod: paymentMethod,
        createdAt: Timestamp.now(),
        ...(transactionData.type === 'expense' && { status: 'pending' }),
        ...(transactionData.cardId && { cardId: transactionData.cardId }),
    };

    try {
        const docRef = await addDoc(collection(db, 'transactions'), newTransactionData);
        return { id: docRef.id, ...newTransactionData };
    } catch (error) {
        console.error("Erro detalhado ao adicionar transação no Firestore: ", error);
        throw error;
    }
};

/**
 * Busca todas as transações de um usuário, retornando o tipo AppTransaction com data como string.
 */
export const getTransactionsByOwner = async (uid: string): Promise<AppTransaction[]> => {
    const q = query(collection(db, "transactions"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const transactions: AppTransaction[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        let dateStr: string;
        const dateValue = data.date;

        if (dateValue instanceof Timestamp) {
            dateStr = dateValue.toDate().toISOString().split('T')[0];
        } else {
            dateStr = String(dateValue || new Date().toISOString().split('T')[0]);
        }

        transactions.push({
            ...data,
            id: doc.id,
            date: dateStr,
        } as AppTransaction);
    });
    return transactions;
};


// Função para atualizar o status de uma transação
export const updateTransactionStatus = async (transactionId: string, newStatus: 'paid' | 'pending') => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      status: newStatus
    });
  } catch (error) {
    console.error("Erro ao atualizar status da transação: ", error);
    throw new Error("Não foi possível atualizar o status.");
  }
};
