
import { getDb } from './firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { toCents } from './currencyUtils';

const BUDGETS_COLLECTION = 'budgets';

const BudgetSchema = z.object({
  uid: z.string().min(1, "UID do usuário é obrigatório."),
  name: z.string().min(1, "O nome do orçamento é obrigatório.").max(50),
  category: z.string().min(1, "A categoria é obrigatória.").max(50),
  limit: z.number().positive("O limite deve ser um valor positivo."),
});

const UpdateBudgetSchema = z.object({
  name: z.string().min(1, "O nome do orçamento é obrigatório.").max(50),
  category: z.string().min(1, "A categoria é obrigatória.").max(50),
  limit: z.number().positive("O limite deve ser um valor positivo."),
});

const UpdateSpentSchema = z.object({
    budgetId: z.string().min(1, "ID do orçamento é obrigatório."),
    transactionAmount: z.number().positive("O valor da transação deve ser positivo."),
});

type BudgetInput = z.infer<typeof BudgetSchema>;

export interface Budget extends Omit<BudgetInput, 'limit'> {
  id: string;
  limit: number; 
  spent: number; 
}

export const addBudget = async (budgetInput: BudgetInput) => {
  const validation = BudgetSchema.safeParse(budgetInput);
  if (!validation.success) {
    throw new Error(`Dados do orçamento inválidos: ${validation.error.flatten().fieldErrors}`);
  }

  const { limit, ...restData } = validation.data;

  try {
    const firestore = getDb();
    if (!firestore) {
        console.error("A conexão com o Firestore não está disponível.");
        throw new Error("Não foi possível adicionar o orçamento.");
    }
    const docRef = await firestore.collection(BUDGETS_COLLECTION).add({
      ...restData,
      limit: toCents(limit), 
      spent: 0, 
      createdAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar orçamento: ", error);
    throw new Error("Não foi possível adicionar o orçamento.");
  }
};

export const getBudgetsByOwner = async (uid: string): Promise<Budget[]> => {
  if (!uid) throw new Error("UID do usuário é obrigatório.");

  try {
    const firestore = getDb();
    if (!firestore) {
        console.error("A conexão com o Firestore não está disponível.");
        return [];
    }
    const q = firestore.collection(BUDGETS_COLLECTION).where("uid", "==", uid);
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Budget, 'id'>)
    }));
  } catch (error) {
    console.error("Erro ao buscar orçamentos: ", error);
    throw new Error("Não foi possível buscar os orçamentos.");
  }
};

export const updateBudget = async (budgetId: string, uid: string, budgetUpdate: { name: string, category: string, limit: number }) => {
  const validation = UpdateBudgetSchema.safeParse(budgetUpdate);
  if (!validation.success) {
    throw new Error(`Dados do orçamento inválidos: ${validation.error.flatten().fieldErrors}`);
  }

  const firestore = getDb();
  if (!firestore) {
    console.error("A conexão com o Firestore não está disponível.");
    throw new Error("Não foi possível atualizar o orçamento.");
  }
  const budgetRef = firestore.collection(BUDGETS_COLLECTION).doc(budgetId);
  try {
    const budgetDoc = await budgetRef.get();
    if (!budgetDoc.exists || budgetDoc.data()?.uid !== uid) {
      throw new Error("Orçamento não encontrado ou você não tem permissão para atualizá-lo.");
    }

    const { limit, ...restData } = validation.data;

    await budgetRef.update({
      ...restData,
      limit: toCents(limit),
    });
  } catch (error) {
    console.error("Erro ao atualizar orçamento: ", error);
    throw new Error("Não foi possível atualizar o orçamento.");
  }
}

export const deleteBudgetForOwner = async (budgetId: string, uid: string) => {
  if (!budgetId || !uid) throw new Error("ID do orçamento e UID do usuário são obrigatórios.");

  const firestore = getDb();
  if (!firestore) {
    console.error("A conexão com o Firestore não está disponível.");
    throw new Error("Não foi possível deletar o orçamento.");
  }
  const budgetRef = firestore.collection(BUDGETS_COLLECTION).doc(budgetId);
  try {
    const budgetDoc = await budgetRef.get();
    if (!budgetDoc.exists || budgetDoc.data()?.uid !== uid) {
      throw new Error("Orçamento não encontrado ou você não tem permissão para deletá-lo.");
    }

    await budgetRef.delete();
  } catch (error) {
    console.error("Erro ao deletar orçamento: ", error);
    throw new Error("Não foi possível deletar o orçamento.");
  }
};

export const updateBudgetSpent = async (budgetId: string, transactionAmount: number) => {
    const validation = UpdateSpentSchema.safeParse({ budgetId, transactionAmount });
    if (!validation.success) {
        throw new Error(`Dados de atualização inválidos: ${validation.error.flatten().fieldErrors}`);
    }

    try {
        const firestore = getDb();
        if (!firestore) {
            console.error("A conexão com o Firestore não está disponível.");
            throw new Error("Não foi possível atualizar o valor gasto do orçamento.");
        }
        const budgetRef = firestore.collection(BUDGETS_COLLECTION).doc(budgetId);
        const amountInCents = toCents(transactionAmount);

        await budgetRef.update({
            spent: FieldValue.increment(amountInCents)
        });
    } catch (error) {
        console.error("Erro ao atualizar o valor gasto do orçamento: ", error);
        throw new Error("Não foi possível atualizar o orçamento.");
    }
};
