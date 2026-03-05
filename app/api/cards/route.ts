
import { NextRequest, NextResponse } from 'next/server';
// import { getDb, getAuthAdmin } from '@/lib/firebase-admin';
// import { z } from 'zod';

// const CardSchema = z.object({
//     name: z.string().min(1, "O nome do cartão é obrigatório."),
//     finalNumber: z.string().length(4, "O final do cartão deve ter 4 dígitos."),
//     closingDay: z.number().int().min(1).max(31, "Dia de fechamento inválido."),
//     dueDate: z.number().int().min(1).max(31, "Dia de vencimento inválido."),
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
