
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { toCents, fromCents } from './currencyUtils';

const INVESTMENTS_COLLECTION = 'investments';

// Esquema de validação para a entrada de novos investimentos
const InvestmentSchema = z.object({
  uid: z.string().min(1, { message: "UID do usuário é obrigatório." }),
  type: z.string().min(1, { message: "O tipo de investimento é obrigatório." }),
  initialValue: z.number().positive({ message: "O valor inicial deve ser positivo." }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de data inválido." }),
  institution: z.string().min(1, { message: "A instituição é obrigatória." }),
});

// Tipo para a interface do formulário, inferido do esquema Zod
export type InvestmentInput = z.infer<typeof InvestmentSchema>;

// Interface que representa um investimento, como armazenado e retornado pelo serviço
export interface Investment {
  id: string;
  uid: string;
  type: string;
  initialValue: number; // Valor em reais (float)
  startDate: string; // Data no formato YYYY-MM-DD
  institution: string;
  createdAt: Timestamp; // Timestamp do Firestore
}

/**
 * Adiciona um novo investimento ao Firestore, convertendo o valor para centavos.
 */
export const addInvestment = async (investmentInput: InvestmentInput): Promise<void> => {
  const validationResult = InvestmentSchema.safeParse(investmentInput);
  if (!validationResult.success) {
    const fullError = validationResult.error.flatten();
    const errorMessages = Object.values(fullError.fieldErrors).flat().join(' \n');
    throw new Error(`Dados do investimento inválidos: ${errorMessages}`);
  }

  const { initialValue, ...restOfInvestment } = validationResult.data;
  const valueInCents = toCents(initialValue);

  try {
    await addDoc(collection(db, INVESTMENTS_COLLECTION), {
      ...restOfInvestment,
      initialValue: valueInCents,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao adicionar investimento no Firestore: ", error);
    throw new Error('Ocorreu um erro ao salvar o investimento.');
  }
};

/**
 * Busca todos os investimentos de um usuário, convertendo o valor de centavos para reais.
 */
export const getInvestmentsByOwner = async (uid: string): Promise<Investment[]> => {
  if (!uid) throw new Error("UID do usuário é obrigatório.");

  try {
    const q = query(collection(db, INVESTMENTS_COLLECTION), where("uid", "==", uid), orderBy("startDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            uid: data.uid,
            type: data.type,
            initialValue: fromCents(data.initialValue),
            startDate: data.startDate,
            institution: data.institution,
            createdAt: data.createdAt,
        } as Investment;
    });
  } catch (error) {
    console.error("Erro ao buscar investimentos: ", error);
    throw new Error("Não foi possível buscar os investimentos.");
  }
};
