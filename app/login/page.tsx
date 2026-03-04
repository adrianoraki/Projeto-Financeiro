
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
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
      router.push('/'); // Redireciona para a dashboard se já estiver logado
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redireciona para a dashboard após o login
    } catch (error) {
      setError('Falha ao entrar. Verifique seu e-mail e senha.');
      console.error('Login error: ', error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      router.push('/'); // Redireciona para a dashboard após o login com Google
    } catch (error) {
      setError('Falha ao entrar com o Google. Tente novamente.');
      console.error('Error with Google sign in: ', error);
    }
  };

  if (loading || user) {
    return <div className={styles.loading}>Carregando...</div>; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Bem-vindo de volta!</h1>
        <p className={styles.subtitle}>Acesse sua conta para continuar.</p>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Entrar</button>
        </form>

        <div className={styles.divider}>
          <span>ou continue com</span>
        </div>

        <button onClick={handleGoogleSignIn} className={`${styles.button} ${styles.googleButton}`}>
          Entrar com o Google
        </button>

        <p className={styles.footerText}>
          Não tem uma conta?{' '}
          <Link href="/register" className={styles.link}>Registre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}
