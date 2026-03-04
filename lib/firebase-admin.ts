
import * as admin from 'firebase-admin';

// Garante que o SDK do Firebase Admin não seja inicializado mais de uma vez.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin SDK initialized.');
  } catch (e: any) {
    console.error('Firebase Admin initialization error', e.stack);
  }
}

/**
 * Retorna a instância do Firestore Admin.
 */
export function getDb() {
  return admin.firestore();
}

/**
 * Retorna a instância do Auth Admin.
 */
export function getAuthAdmin() {
  return admin.auth();
}
