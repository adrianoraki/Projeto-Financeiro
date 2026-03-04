
import admin from 'firebase-admin';

// Objeto de configuração do serviço
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Inicializa o Firebase Admin SDK se ainda não tiver sido inicializado
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK inicializado com sucesso.');
  } catch (e: unknown) {
    console.error('Falha na inicialização do Firebase Admin SDK:', e);
  }
}

// Exporta a instância de autenticação e a instância completa do admin
const authAdmin = admin.auth();

export { admin, authAdmin };
