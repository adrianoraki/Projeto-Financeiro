
import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const CardSchema = z.object({
    name: z.string().min(1, "O nome do cartão é obrigatório."),
    finalNumber: z.string().length(4, "O final do cartão deve ter 4 dígitos."),
    closingDay: z.number().int().min(1).max(31, "Dia de fechamento inválido."),
    dueDate: z.number().int().min(1).max(31, "Dia de vencimento inválido."),
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
        const validation = CardSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const firestore = getDb();
        const docRef = await firestore.collection('users').doc(userId).collection('cards').add(validation.data);

        return NextResponse.json({ id: docRef.id, ...validation.data });

    } catch (error) {
        console.error("Failed to create card: ", error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const firestore = getDb();
        const q = firestore.collection('users').doc(userId).collection('cards');
        const querySnapshot = await q.get();
        const cards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(cards);
    } catch (error) {
        console.error("Failed to fetch cards: ", error);
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
}
