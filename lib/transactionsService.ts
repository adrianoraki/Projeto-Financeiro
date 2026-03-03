
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// A interface da transação como ela deve ser salva no Firestore
export interface Transaction {
    id?: string;
    uid: string;
    description: string;
    amount: number;
    date: Timestamp | string; // O formulário envia string, o Firestore usa Timestamp
    type: 'income' | 'expense';
    category: string;       // Campo obrigatório
    paymentMethod: string; // Campo obrigatório
    status?: 'paid' | 'pending';
    createdAt: Timestamp;
}

/**
 * Adiciona uma nova transação ao Firestore.
 * Mapeia os campos do formulário (group, subGroup) para os campos do banco de dados (category, paymentMethod)
 * e garante que os campos obrigatórios tenham valores padrão para evitar violações de segurança.
 */
export const addTransaction = async (transactionData: any) => {
    if (!transactionData.uid) {
        throw new Error("UID do usuário é obrigatório para adicionar transação.");
    }

    // BLINDAGEM FINAL: Garante que os campos obrigatórios tenham um valor padrão.
    const category = transactionData.group || 'Geral';
    const paymentMethod = transactionData.subGroup || (transactionData.type === 'income' ? 'N/A' : 'Não especificado');

    const newTransaction: Omit<Transaction, 'id'> = {
        uid: transactionData.uid,
        description: transactionData.description,
        amount: parseFloat(transactionData.amount), // Garante que o valor seja um número
        date: Timestamp.fromDate(new Date(transactionData.date + 'T00:00:00')), // Converte a data string para Timestamp
        type: transactionData.type,
        category: category,
        paymentMethod: paymentMethod,
        createdAt: Timestamp.now(),
        // Adiciona status apenas se for uma despesa
        ...(transactionData.type === 'expense' && { status: 'pending' })
    };

    try {
        const docRef = await addDoc(collection(db, 'transactions'), newTransaction);
        return { id: docRef.id, ...newTransaction };
    } catch (error) {
        console.error("Erro detalhado ao adicionar transação no Firestore: ", error);
        throw error; // Lança o erro para ser pego pelo catch no componente da UI
    }
};

/**
 * Busca todas as transações de um usuário.
 */
export const getTransactions = async (uid: string): Promise<Transaction[]> => {
    const q = query(collection(db, 'transactions'), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });
    return transactions;
};
