
import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';
import { toCents } from '@/lib/currencyUtils';

const GoalSchema = z.object({
    name: z.string().min(1, "O nome da meta é obrigatório."),
    targetAmount: z.number().positive("O valor alvo deve ser positivo."),
    deadline: z.string().optional(), // ou z.date() dependendo de como você envia do frontend
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
        const validation = GoalSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { targetAmount, ...restData } = validation.data;

        const firestore = getDb();
        const docRef = await firestore.collection('users').doc(userId).collection('goals').add({
            ...restData,
            targetAmount: toCents(targetAmount),
            currentAmount: 0,
            createdAt: new Date(),
        });

        return NextResponse.json({ id: docRef.id, ...validation.data, currentAmount: 0 });

    } catch (error) {
        console.error("Failed to create goal: ", error);
        return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const firestore = getDb();
        const q = firestore.collection('users').doc(userId).collection('goals');
        const querySnapshot = await q.get();
        const goals = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json(goals);
    } catch (error) {
        console.error("Failed to fetch goals: ", error);
        return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }
}
