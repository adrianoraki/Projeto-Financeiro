
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Define the structure of a Card object
export interface Card {
  id?: string; // Firestore document ID
  uid: string; // User ID
  cardName: string;
  cardBrand: string;
}

// --- Service Functions ---

/**
 * Adds a new credit card to the user's profile.
 * @param cardData - The card data to add (must include uid, cardName, cardBrand).
 * @returns The newly created card object with its Firestore ID.
 */
export const addCard = async (cardData: Omit<Card, 'id'>): Promise<Card> => {
  try {
    const docRef = await addDoc(collection(db, 'cards'), cardData);
    return { id: docRef.id, ...cardData };
  } catch (error) {
    console.error("Error adding card: ", error);
    throw new Error('Failed to add card.');
  }
};

/**
 * Fetches all credit cards for a given user.
 * @param uid - The user's unique ID.
 * @returns A promise that resolves to an array of card objects.
 */
export const getCards = async (uid: string): Promise<Card[]> => {
  try {
    const q = query(collection(db, 'cards'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const cards: Card[] = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() } as Card);
    });
    return cards;
  } catch (error) {
    console.error("Error fetching cards: ", error);
    throw new Error('Failed to fetch cards.');
  }
};

/**
 * Fetches a single card by its ID.
 * @param cardId - The document ID of the card.
 * @returns A promise that resolves to the card object.
 */
export const getCardById = async (cardId: string): Promise<Card | null> => {
    try {
        const docRef = doc(db, 'cards', cardId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Card;
        }
        return null;
    } catch (error) {
        console.error("Error fetching card by ID: ", error);
        throw new Error('Failed to fetch card.');
    }
};
