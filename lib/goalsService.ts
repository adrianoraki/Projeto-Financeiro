
import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const GOALS_COLLECTION = 'goals';

// Interface para o objeto de Meta
export interface Goal {
  id?: string;
  uid: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: Date;
}

// Adicionar uma nova meta
export const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, GOALS_COLLECTION), {
      ...goalData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Erro ao adicionar meta: ", error);
    throw new Error('Não foi possível adicionar a meta.');
  }
};

// Buscar todas as metas de um usuário
export const getGoals = async (uid: string): Promise<Goal[]> => {
  try {
    const q = query(collection(db, GOALS_COLLECTION), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const goals: Goal[] = [];
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() } as Goal);
    });
    return goals;
  } catch (error) {
    console.error("Erro ao buscar metas: ", error);
    return [];
  }
};

// Atualizar uma meta (ex: adicionar dinheiro)
export const updateGoal = async (goalId: string, updatedData: Partial<Goal>) => {
  try {
    const goalDoc = doc(db, GOALS_COLLECTION, goalId);
    await updateDoc(goalDoc, updatedData);
  } catch (error) {
    console.error("Erro ao atualizar meta: ", error);
    throw new Error('Não foi possível atualizar a meta.');
  }
};

// Deletar uma meta
export const deleteGoal = async (goalId: string) => {
  try {
    const goalDoc = doc(db, GOALS_COLLECTION, goalId);
    await deleteDoc(goalDoc);
  } catch (error) {
    console.error("Erro ao deletar meta: ", error);
    throw new Error('Não foi possível deletar a meta.');
  }
};
