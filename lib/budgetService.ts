
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from 'firebase/firestore';

const budgetsCollection = collection(db, 'budgets');

// Add a new budget category for a user
export const addBudget = async (userId: string, category: string, limit: number) => {
  try {
    const docRef = await addDoc(budgetsCollection, {
      userId,
      category,
      limit,
      spent: 0, // Initially, no amount is spent
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding budget: ", error);
    throw new Error("Could not add budget.");
  }
};

// Get all budget categories for a user
export const getBudgets = async (userId: string) => {
  try {
    const q = query(budgetsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const budgets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return budgets;
  } catch (error) {
    console.error("Error getting budgets: ", error);
    throw new Error("Could not retrieve budgets.");
  }
};

// Update the spent amount for a budget category
export const updateBudgetSpent = async (budgetId: string, amount: number) => {
  try {
    const budgetDoc = doc(db, 'budgets', budgetId);
    await updateDoc(budgetDoc, {
      spent: increment(amount)
    });
  } catch (error) {
    console.error("Error updating budget spent amount: ", error);
    throw new Error("Could not update budget.");
  }
}
