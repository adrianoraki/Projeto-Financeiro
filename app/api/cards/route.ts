
import { NextResponse } from 'next/server';
import { getDb, getAuthAdmin } from '@/lib/firebase-admin'; 

async function verifyAuth(request: Request) {
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    throw new Error('No token provided');
  }
  // Chama a função para obter a instância do auth
  const decodedToken = await getAuthAdmin().verifyIdToken(idToken);
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

    // Chama a função para obter a instância do db
    const cardRef = await getDb().collection('cards').add(cardData);

    return NextResponse.json({ id: cardRef.id, ...cardData }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar cartão:', error);
    if (error instanceof Error && error.message.includes('No token provided')){
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
