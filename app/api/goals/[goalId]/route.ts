
import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin'; // Caminho corrigido com alias
import { FieldValue } from 'firebase-admin/firestore';

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

export async function GET(req: NextRequest, { params }: { params: { goalId: string } }) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { goalId } = params;
    try {
        const firestore = getDb();
        const goalDoc = await firestore.collection('users').doc(userId).collection('goals').doc(goalId).get();

        if (!goalDoc.exists) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }
        return NextResponse.json({ id: goalDoc.id, ...goalDoc.data() });
    } catch (error) {
        console.error("Failed to fetch goal:", error);
        return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { goalId: string } }) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { goalId } = params;
    try {
        const { name, targetAmount, icon } = await req.json();
        if (!name || typeof targetAmount !== 'number' || targetAmount <= 0) {
            return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
        }

        const firestore = getDb();
        await firestore.collection('users').doc(userId).collection('goals').doc(goalId).update({ name, targetAmount, icon });
        return NextResponse.json({ message: 'Goal updated successfully' });
    } catch (error) {
        console.error("Failed to update goal:", error);
        return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { goalId: string } }) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { goalId } = params;
    try {
        const firestore = getDb();
        await firestore.collection('users').doc(userId).collection('goals').doc(goalId).delete();
        return NextResponse.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error("Failed to delete goal:", error);
        return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { goalId: string } }) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { goalId } = params;
    try {
        const { amount, goalName } = await req.json();
        if (typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const firestore = getDb();
        const batch = firestore.batch();
        const goalRef = firestore.collection('users').doc(userId).collection('goals').doc(goalId);
        const transactionRef = firestore.collection('users').doc(userId).collection('transactions').doc();

        batch.update(goalRef, { currentAmount: FieldValue.increment(amount) });

        batch.set(transactionRef, {
            amount: -amount,
            date: new Date().toISOString(),
            description: `Adicionado à meta: ${goalName || ''}`.trim(),
            category: 'Economia para Meta',
            type: 'expense',
            createdAt: FieldValue.serverTimestamp(),
        });

        await batch.commit();

        return NextResponse.json({ message: 'Funds added and transaction created successfully' });

    } catch (error) {
        console.error("Error adding funds to goal:", error);
        return NextResponse.json({ error: 'Failed to add funds' }, { status: 500 });
    }
}
