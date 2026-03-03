
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin'; // Usaremos o SDK Admin no lado do servidor
import { getAuth } from 'firebase-admin/auth';

// Função para verificar o token de autenticação
async function verifyAuth(request: Request) {
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    throw new Error('No token provided');
  }
  const decodedToken = await getAuth().verifyIdToken(idToken);
  return decodedToken.uid;
}

export async function POST(request: Request) {
  try {
    const uid = await verifyAuth(request);
    const body = await request.json();
    const { cardName, cardBrand, cardDueDate } = body;

    if (!cardName || !cardBrand || !cardDueDate) {
      return NextResponse.json({ error: 'Dados do cartão incompletos' }, { status: 400 });
    }

    const cardData = {
      userId: uid,
      name: cardName,
      brand: cardBrand,
      dueDate: cardDueDate,
      createdAt: new Date(),
    };

    const cardRef = await db.collection('cards').add(cardData);

    return NextResponse.json({ id: cardRef.id, ...cardData }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar cartão:', error);
    if (error instanceof Error && error.message.includes('No token provided')){
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
