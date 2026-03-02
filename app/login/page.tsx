
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, provider } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import styles from '../../styles/Auth.module.css';

export default function AuthPage() {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // O redirecionamento será tratado pelo useEffect
    } catch (error) {
      if (isLogin) {
        setError('Falha ao entrar. Verifique suas credenciais.');
      } else {
        setError('Falha ao registrar. Tente novamente.');
      }
      console.error('Authentication error: ', error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      // O redirecionamento será tratado pelo useEffect
    } catch (error) {
      setError('Falha ao entrar com o Google. Tente novamente.');
      console.error('Error with Google sign in: ', error);
    }
  };

  if (loading) {
    return null; // Ou um spinner de carregamento
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.formContainer}>
        <h1>{isLogin ? 'Login' : 'Registrar'}</h1>
        <form onSubmit={handleAuthAction}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Entrar' : 'Registrar'}</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <button onClick={handleGoogleSignIn} className={styles.googleButton}>
          Entrar com o Google
        </button>

        <p>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
            {isLogin ? 'Registre-se aqui' : 'Faça login aqui'}
          </a>
        </p>
      </div>
    </div>
  );
}
