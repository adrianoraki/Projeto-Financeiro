
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Login.module.css';
import LandingHeader from '../../components/layout/LandingHeader';

const LoginPage: React.FC = () => {
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSignUpClick = () => setSignUpActive(true);
  const handleSignInClick = () => setSignUpActive(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Falha no login. Verifique suas credenciais.');
      } else {
        setError('Ocorreu um erro desconhecido durante o login.');
      }
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email, password, name);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Falha no cadastro. Tente novamente.');
      } else {
        setError('Ocorreu um erro desconhecido durante o cadastro.');
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <LandingHeader />
      <div className={`${styles.container} ${isSignUpActive ? styles.rightPanelActive : ''}`}>
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form onSubmit={handleSignUpSubmit}>
            <h1>Criar Conta</h1>
            {error && isSignUpActive && <p className={styles.error}>{error}</p>}
            <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className={styles.btnMain}>Cadastrar</button>
          </form>
        </div>

        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form onSubmit={handleLoginSubmit}>
            <h1>Entrar</h1>
            {error && !isSignUpActive && <p className={styles.error}>{error}</p>}
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <a href="#">Esqueceu a senha?</a>
            <button type="submit" className={styles.btnMain}>Entrar</button>
          </form>
        </div>

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Bem-vindo de volta!</h1>
              <p>Para manter-se conectado, faça login com suas informações pessoais</p>
              <button className={styles.btnGhost} onClick={handleSignInClick}>Ir para Login</button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Olá, Amigo!</h1>
              <p>Insira seus dados pessoais e comece sua jornada conosco</p>
              <button className={styles.btnGhost} onClick={handleSignUpClick}>Ir para Cadastro</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
