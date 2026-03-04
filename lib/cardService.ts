
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';

const CARDS_COLLECTION = 'cards';

// Zod schema for card validation
const CardSchema = z.object({
  uid: z.string().min(1, "UID do usuário é obrigatório."),
  cardName: z.string().min(1, "Nome do cartão é obrigatório.").max(50),
  cardBrand: z.string().min(1, "Bandeira do cartão é obrigatória.").max(50),
});

// Base type for a card, used for function inputs
type CardInput = z.infer<typeof CardSchema>;

// The full Card object type, including the Firestore ID
export interface Card extends CardInput {
  id: string;
}

/**
 * Adds a new credit card to Firestore after validating the input data.
 * @param cardInput - The card data to add.
 * @returns The newly created card object with its Firestore ID.
 */
export const addCard = async (cardInput: CardInput): Promise<Card> => {
  const validationResult = CardSchema.safeParse(cardInput);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.flatten().fieldErrors;
    console.error("Erro de validação ao adicionar cartão: ", errorMessages);
    throw new Error(`Dados do cartão inválidos: ${Object.values(errorMessages).flat().join(', ')}`);
  }

  try {
    const docRef = await addDoc(collection(db, CARDS_COLLECTION), validationResult.data);
    return { id: docRef.id, ...validationResult.data };
  } catch (error) {
    console.error("Erro ao adicionar cartão no Firestore: ", error);
    throw new Error('Ocorreu um erro ao salvar o cartão.');
  }
};

/**
 * Fetches all credit cards for a specific user.
 * Ensures that only cards belonging to the user are returned.
 * @param uid - The user's unique ID.
 * @returns A promise that resolves to an array of card objects.
 */
export const getCardsByOwner = async (uid: string): Promise<Card[]> => {
  if (!uid) {
    throw new Error("UID do usuário é obrigatório para buscar os cartões.");
  }

  try {
    const q = query(collection(db, CARDS_COLLECTION), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    const cards = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as CardInput)
    }));

    return cards;
  } catch (error) {
    console.error("Erro ao buscar cartões: ", error);
    throw new Error('Não foi possível buscar os cartões.');
  }
};

/**
 * SECURELY fetches a single card by its ID, ensuring it belongs to the requesting user.
 * @param cardId - The document ID of the card.
 * @param uid - The unique ID of the user making the request.
 * @returns A promise that resolves to the card object, or null if not found or not owned by the user.
 */
export const getCardByIdAndOwner = async (cardId: string, uid: string): Promise<Card | null> => {
  if (!cardId || !uid) {
      throw new Error("ID do cartão e UID do usuário são obrigatórios.");
  }

  try {
    const docRef = doc(db, CARDS_COLLECTION, cardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().uid === uid) {
      // The card exists and belongs to the user
      return { id: docSnap.id, ...(docSnap.data() as CardInput) };
    }
    
    // Return null if the card doesn't exist or the user is not the owner
    return null;

  } catch (error) {
    console.error("Erro ao buscar cartão por ID: ", error);
    throw new Error('Não foi possível buscar o cartão.');
  }
};
