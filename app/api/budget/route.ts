
import { NextRequest, NextResponse } from 'next/server';
// import { getAuth } from 'firebase-admin/auth';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getDb, getAuthAdmin } from '@/lib/firebase-admin'; // Corrigido
// import { z } from 'zod';
// import { toCents } from '@/lib/currencyUtils';

// const BudgetSchema = z.object({
//   name: z.string().min(1, "O nome do orçamento é obrigatório.").max(50),
//   category: z.string().min(1, "A categoria é obrigatória.").max(50),
//   limit: z.number().positive("O limite deve ser um valor positivo."),
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
