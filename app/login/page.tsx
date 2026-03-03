
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import styles from '../../styles/Auth.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const { user } = useAuth();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth); 
        setError('Seu e-mail ainda não foi verificado. Por favor, cheque sua caixa de entrada e clique no link de confirmação.');
        return;
      }

    } catch (error) {
      setError('Falha ao entrar. Verifique seu e-mail e senha.');
      console.error('Login error: ', error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Falha ao entrar com o Google. Tente novamente.');
      console.error('Error with Google sign in: ', error);
    }
  };

  if (loading) {
    return null; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.formContainer}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Entrar</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <button onClick={handleGoogleSignIn} className={styles.googleButton}>
          Entrar com o Google
        </button>

        <p>
          Não tem uma conta?{' '}
          <Link href="/register">Registre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}
