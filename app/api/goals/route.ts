
import { NextRequest, NextResponse } from 'next/server';
// import { getDb, getAuthAdmin } from '@/lib/firebase-admin';
// import { z } from 'zod';
// import { toCents } from '@/lib/currencyUtils';

// const GoalSchema = z.object({
//     name: z.string().min(1, "O nome da meta é obrigatório."),
//     targetAmount: z.number().positive("O valor alvo deve ser positivo."),
//     deadline: z.string().optional(), // ou z.date() dependendo de como você envia do frontend
// });

// async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
//     // const authorization = req.headers.get('Authorization');
//     // if (authorization?.startsWith('Bearer ')) {
//     //     const idToken = authorization.split('Bearer ')[1];
//     //     try {
//     //         const authAdmin = getAuthAdmin();
//     //         if (!authAdmin) return null;
//     //         const decodedToken = await authAdmin.verifyIdToken(idToken);
//     //         return decodedToken.uid;
//     //     } catch (error) {
//     //         console.error("Error verifying auth token:", error);
//     //         return null;
//     //     }
//     // }
//     return null;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest) { // req renomeado para _req
    return NextResponse.json({ message: 'API route is temporarily disabled' });
    // O restante do código permanece comentado
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) { // req renomeado para _req
    return NextResponse.json({ message: 'API route is temporarily disabled' });
    // O restante do código permanece comentado
}
