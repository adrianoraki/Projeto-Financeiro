
import { db } from './firebase';
import {
  collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp
} from 'firebase/firestore';

// --- Base Interface ---
export interface PaymentMethod {
    id?: string;
    uid: string;
    name: string; // Ex: "Nubank", "Banco do Brasil", "Boleto Genérico"
    type: 'creditCard' | 'pix' | 'boleto' | 'debit';
    createdAt: any;
}

// --- Specific Interfaces ---
export interface CreditCardDetails {
    brand: string; // "Visa", "Mastercard"
    invoiceDueDate: number; // Dia do vencimento
}

export interface PixDetails {
    bank: string; // "Itaú", "Bradesco"
    paymentType: 'avista' | 'parcelado';
}

export interface BoletoDetails {
    paymentType: 'avista' | 'parcelado';
}

export interface DebitDetails {
    bank: string;
    paymentType: 'avista';
}

// --- Combined Types ---
export type PaymentMethodDetails = CreditCardDetails | PixDetails | BoletoDetails | DebitDetails;
export type PaymentMethodRecord = PaymentMethod & {
    details: PaymentMethodDetails;
};

// --- Service Functions ---

/**
 * Fetches all payment methods for a given user.
 */
export const getPaymentMethods = async (uid: string): Promise<PaymentMethodRecord[]> => {
    if (!uid) throw new Error("UID do usuário é necessário para buscar as formas de pagamento.");
    
    const q = query(collection(db, 'paymentMethods'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    const methods: PaymentMethodRecord[] = [];
    querySnapshot.forEach(doc => {
        methods.push({ id: doc.id, ...doc.data() } as PaymentMethodRecord);
    });
    
    return methods;
};

/**
 * Adds a new payment method to Firestore.
 */
export const addPaymentMethod = async (paymentMethodData: Omit<PaymentMethodRecord, 'id' | 'createdAt'>): Promise<PaymentMethodRecord> => {
    if (!paymentMethodData.uid) throw new Error("UID do usuário é necessário para adicionar uma forma de pagamento.");

    const docRef = await addDoc(collection(db, 'paymentMethods'), {
        ...paymentMethodData,
        createdAt: serverTimestamp()
    });

    return { 
        id: docRef.id,
        ...paymentMethodData,
        createdAt: new Date() // Return a client-side date for immediate use
    } as PaymentMethodRecord;
};

/**
 * Deletes a payment method from Firestore.
 */
export const deletePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    if (!paymentMethodId) throw new Error("ID da forma de pagamento é necessário para deletá-la.");
    
    const docRef = doc(db, 'paymentMethods', paymentMethodId);
    await deleteDoc(docRef);
};
