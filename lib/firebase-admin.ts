
import admin from 'firebase-admin';

const getAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    // Retorna um app "falso" ou lança um erro mais informativo
    // durante o build, se necessário, mas não tenta inicializar.
    // Para o build do Next.js, é melhor apenas não inicializar.
    console.warn("Firebase Admin credentials not available during build time. Skipping initialization.");
    // Retornamos um objeto que simula a interface do admin.app() mas não faz nada,
    // para evitar que o build quebre ao tentar acessar propriedades como 'firestore'.
    return {
      firestore: () => ({}), // Retorna um objeto vazio para 'firestore'
      auth: () => ({}),      // Retorna um objeto vazio para 'auth'
    } as any; // Usamos 'as any' para contornar a checagem de tipos aqui
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

const getDb = () => getAdminApp().firestore();
const getAuthAdmin = () => getAdminApp().auth();

// Agora, exportamos as funções que obtêm as instâncias
// em vez das instâncias diretamente.
export { getDb, getAuthAdmin };
