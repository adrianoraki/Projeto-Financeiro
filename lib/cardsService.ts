
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, DocumentReference } from 'firebase/firestore';
import { db } from './firebase';

export interface CreditCard {
  id?: string;
  uid: string;
  name: string;
  brand: string;
  invoiceDueDate: number;
}

// Change: Now returns the full CreditCard object with the new ID.
export const addCard = async (cardData: Omit<CreditCard, 'id'>): Promise<CreditCard> => {
  const docRef = await addDoc(collection(db, 'creditCards'), cardData);
  return {
    id: docRef.id,
    ...cardData
  };
};

// Buscar todos os cartões de crédito de um usuário
export const getCards = async (uid: string): Promise<CreditCard[]> => {
  const q = query(collection(db, "creditCards"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const cards: CreditCard[] = [];
  querySnapshot.forEach((doc) => {
    cards.push({ id: doc.id, ...(doc.data() as Omit<CreditCard, 'id'>) });
  });
  return cards;
};

// Deletar um cartão de crédito
export const deleteCard = async (cardId: string) => {
  await deleteDoc(doc(db, 'creditCards', cardId));
};
