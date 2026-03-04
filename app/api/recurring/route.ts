
import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';
import { toCents } from '@/lib/currencyUtils';

const RecurringTransactionSchema = z.object({
    description: z.string().min(1, "A descrição é obrigatória."),
    amount: z.number().positive("O valor deve ser positivo."),
    type: z.enum(['income', 'expense']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    category: z.string().min(1, "A categoria é obrigatória."),
    budgetId: z.string().optional(),
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
        const validation = RecurringTransactionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
        }
        
        const { amount, ...restData } = validation.data;

        const firestore = getDb();
        const docRef = await firestore.collection('users').doc(userId).collection('recurringTransactions').add({
            ...restData,
            amount: toCents(amount),
            lastRun: new Date(),
            createdAt: new Date(),
        });

        return NextResponse.json({ id: docRef.id, ...validation.data });

    } catch (error) {
        console.error("Failed to create recurring transaction: ", error);
        return NextResponse.json({ error: 'Failed to create recurring transaction' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const firestore = getDb();
        const q = firestore.collection('users').doc(userId).collection('recurringTransactions');
        const querySnapshot = await q.get();
        const transactions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Failed to fetch recurring transactions: ", error);
        return NextResponse.json({ error: 'Failed to fetch recurring transactions' }, { status: 500 });
    }
}

