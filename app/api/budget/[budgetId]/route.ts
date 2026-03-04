
import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';
import { toCents } from '@/lib/currencyUtils';

const UpdateBudgetSchema = z.object({
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

export async function PUT(req: NextRequest, { params }: { params: { budgetId: string } }) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { budgetId } = params;
    try {
        const body = await req.json();
        const validation = UpdateBudgetSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, category, limit } = validation.data;
        const firestore = getDb();
        const budgetRef = firestore.collection('users').doc(userId).collection('budgets').doc(budgetId);
        
        const budgetDoc = await budgetRef.get();
        if (!budgetDoc.exists) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        await budgetRef.update({
            name,
            category,
            limit: toCents(limit),
        });

        return NextResponse.json({ message: 'Budget updated successfully' });

    } catch (error) {
        console.error("Failed to update budget:", error);
        return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { budgetId: string } }) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { budgetId } = params;
    try {
        const firestore = getDb();
        const budgetRef = firestore.collection('users').doc(userId).collection('budgets').doc(budgetId);

        const budgetDoc = await budgetRef.get();
        if (!budgetDoc.exists) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        await budgetRef.delete();
        return NextResponse.json({ message: 'Budget deleted successfully' });

    } catch (error) {
        console.error("Failed to delete budget:", error);
        return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
    }
}
