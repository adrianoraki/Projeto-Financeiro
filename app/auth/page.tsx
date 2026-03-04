
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext'; // Ajuste o caminho conforme necessário
import styles from '../../styles/Auth.module.css';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, login, signup, loginWithGoogle, loginWithGitHub, logout } = useAuth();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.authBox}>
            <h1 className={styles.title}>Bem-vindo!</h1>
            <p>Você está logado como {user.email}</p>
            <button onClick={logout} className={styles.primaryButton}>Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>{isLogin ? 'Login' : 'Criar Conta'}</h1>
        <p className={styles.subtitle}>
          Gerencie suas finanças de forma inteligente.
        </p>

        <form onSubmit={handleAuthAction}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Sua senha"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.primaryButton} disabled={loading}>
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className={styles.divider}>ou continue com</div>

        <div className={styles.socialLogin}>
          <button onClick={loginWithGoogle} className={styles.socialButton} aria-label="Login com Google">
            <FaGoogle />
          </button>
          <button onClick={loginWithGitHub} className={styles.socialButton} aria-label="Login com GitHub">
            <FaGithub />
          </button>
        </div>

        <p className={styles.toggleAuth}>
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleButton}>
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
