
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin'; // Corrigido
import { z } from 'zod';
import { toCents } from '@/lib/currencyUtils';

const BudgetSchema = z.object({
  name: z.string().min(1, "O nome do orçamento é obrigatório.").max(50),
  category: z.string().min(1, "A categoria é obrigatória.").max(50),
  limit: z.number().positive("O limite deve ser um valor positivo."),
});

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
    const authorization = req.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        try {
            const authAdmin = getAuthAdmin();
            const decodedToken = await authAdmin.verifyIdToken(idToken);
            return decodedToken.uid;
        } catch (error) {
            console.error("Error verifying auth token:", error);
            return null;
        }
    }
    return null;
}

export async function POST(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validation = BudgetSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, category, limit } = validation.data;
        const firestore = getDb();
        const docRef = await firestore.collection('users').doc(userId).collection('budgets').add({
            name,
            category,
            limit: toCents(limit),
            spent: 0,
            createdAt: new Date(),
        });

        return NextResponse.json({ id: docRef.id, name, category, limit, spent: 0 });

    } catch (error) {
        console.error("Erro ao criar orçamento: ", error);
        return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const firestore = getDb();
        const q = firestore.collection('users').doc(userId).collection('budgets');
        const querySnapshot = await q.get();
        const budgets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            limit: doc.data().limit / 100, // Converter de centavos para a unidade principal
            spent: doc.data().spent / 100,
        }));
        return NextResponse.json(budgets);
    } catch (error) {
        console.error("Erro ao buscar orçamentos: ", error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}
