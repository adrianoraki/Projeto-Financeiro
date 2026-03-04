
import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  writeBatch,
  increment,
  getDoc
} from 'firebase/firestore';
import { z } from 'zod';
import { toCents } from './currencyUtils';

const GOALS_COLLECTION = 'goals';

// Schema for creating a goal
const GoalSchema = z.object({
  uid: z.string().min(1, "UID do usuário é obrigatório."),
  name: z.string().min(1, "O nome da meta é obrigatório.").max(70),
  targetAmount: z.number().positive("O valor alvo deve ser positivo."),
  icon: z.string().optional(), // Adicionado para suportar ícones de meta
});

// Schema for adding funds to a goal
const AddFundsSchema = z.object({
  amount: z.number().positive("O valor a ser adicionado deve ser positivo."),
});

type GoalInput = z.infer<typeof GoalSchema>;

export interface Goal extends Omit<GoalInput, 'targetAmount'> {
  id: string;
  targetAmount: number; // Stored in cents
  currentAmount: number; // Stored in cents
  createdAt: Date; 
}

/**
 * Adds a new goal, storing monetary values in cents.
 */
export const addGoal = async (goalInput: GoalInput): Promise<string> => {
  const validation = GoalSchema.safeParse(goalInput);
  if (!validation.success) {
    throw new Error(`Dados da meta inválidos: ${validation.error.flatten().fieldErrors}`);
  }

  const { targetAmount, ...restData } = validation.data;

  try {
    const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
      ...restData,
      targetAmount: toCents(targetAmount),
      currentAmount: 0, // Always starts with 0
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar meta: ", error);
    throw new Error('Não foi possível adicionar a meta.');
  }
};

/**
 * Retrieves all goals for a specific user.
 */
export const getGoalsByOwner = async (uid: string): Promise<Goal[]> => {
  if (!uid) throw new Error("UID do usuário é obrigatório.");

  try {
    const q = query(collection(db, GOALS_COLLECTION), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Goal));
  } catch (error) {
    console.error("Erro ao buscar metas: ", error);
    throw new Error("Não foi possível buscar as metas.");
  }
};

/**
 * Securely adds funds to a user's goal, verifying ownership.
 */
export const addFundsToGoal = async (goalId: string, uid: string, amount: number) => {
  const validation = AddFundsSchema.safeParse({ amount });
  if (!validation.success) {
    throw new Error(`Valor inválido: ${validation.error.flatten().fieldErrors.amount}`);
  }

  const goalRef = doc(db, GOALS_COLLECTION, goalId);
  const batch = writeBatch(db);

  try {
    const goalDoc = await getDoc(goalRef); // We need to get the doc to check ownership
    if (!goalDoc.exists() || goalDoc.data().uid !== uid) {
      throw new Error("Meta não encontrada ou você não tem permissão para atualizá-la.");
    }

    batch.update(goalRef, { currentAmount: increment(toCents(amount)) });
    await batch.commit();

  } catch (error) {
    console.error("Erro ao adicionar fundos à meta: ", error);
    if (error instanceof Error && error.message.includes("permissão")) {
        throw error;
    }
    throw new Error("Não foi possível adicionar fundos à meta.");
  }
};

/**
 * Securely deletes a goal, verifying ownership before deletion.
 */
export const deleteGoalForOwner = async (goalId: string, uid: string) => {
  if (!goalId || !uid) throw new Error("ID da meta e UID do usuário são obrigatórios.");

  const goalRef = doc(db, GOALS_COLLECTION, goalId);

  try {
    const goalDoc = await getDoc(goalRef);
    if (!goalDoc.exists() || goalDoc.data().uid !== uid) {
      throw new Error("Meta não encontrada ou você não tem permissão para deletá-la.");
    }

    await deleteDoc(goalRef);

  } catch (error) {
    console.error("Erro ao deletar meta: ", error);
    if (error instanceof Error && error.message.includes("permissão")) {
        throw error;
    }
    throw new Error("Não foi possível deletar a meta.");
  }
};
