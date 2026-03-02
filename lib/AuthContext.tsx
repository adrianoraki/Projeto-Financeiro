
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { auth, storage } from './firebase'; // Importa o storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Funções do Storage
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  updateUserProfileImage: (file: File) => Promise<void>; // Nova função
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  // Nova função para atualizar a imagem de perfil
  const updateUserProfileImage = async (file: File) => {
    if (!user) return;

    // 1. Criar uma referência para o arquivo no Storage
    const storageRef = ref(storage, `profile_images/${user.uid}`);

    try {
      // 2. Fazer o upload do arquivo
      setLoading(true);
      await uploadBytes(storageRef, file);

      // 3. Obter a URL de download
      const photoURL = await getDownloadURL(storageRef);

      // 4. Atualizar o perfil do usuário no Firebase Auth
      await updateProfile(user, { photoURL });

      // 5. Atualizar o estado local (opcional, mas bom para UI)
      setUser({ ...user, photoURL });

    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = { user, loading, logout, updateUserProfileImage };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
