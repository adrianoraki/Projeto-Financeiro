
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import styles from '../../styles/Auth.module.css';
import Link from 'next/link';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.tooltipIcon}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c0-.662.538-1.2 1.2-1.2s1.2.538 1.2 1.2v5.25c0 .662-.538 1.2-1.2 1.2s-1.2-.538-1.2-1.2V10.558zM12 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
);

export default function RegisterPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardBrand, setCardBrand] = useState('');
  const [cardDueDate, setCardDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCardFields, setShowCardFields] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Se o usuário decidiu adicionar um cartão, fazemos a chamada para a API
      if (showCardFields && cardName && cardBrand && cardDueDate) {
        const idToken = await userCredential.user.getIdToken();
        const response = await fetch('/api/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ 
            name: cardName, 
            brand: cardBrand, 
            closingDay: parseInt(cardDueDate, 10),
            dueDay: parseInt(cardDueDate, 10) + 7 // Exemplo, adicione a lógica correta
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Mesmo com erro no cartão, o usuário foi criado. Informamos e redirecionamos.
          setError(`Usuário criado, mas falha ao salvar cartão: ${errorData.error}`);
          setTimeout(() => router.push('/'), 3000);
          return;
        }
      }
      
      router.push('/'); // Redireciona para o dashboard
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Tente fazer login.');
      } else {
        setError('Falha ao registrar. Verifique os dados e tente novamente.');
      }
      console.error('Registration error: ', error);
    }
  };

  if (loading || user) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>Comece a organizar suas finanças hoje mesmo.</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.input}
          />
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
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />

          <div className={styles.optionalActionContainer}>
             <button 
              type="button"
              className={styles.toggleCardButton}
              onClick={() => setShowCardFields(!showCardFields)}
            >
              {showCardFields ? 'Cancelar Cartão' : '+ Adicionar Cartão de Crédito (Opcional)'}
            </button>
            <div className={styles.tooltipContainer}>
                <InfoIcon />
                <span className={styles.tooltipText}>
                  Fique tranquilo! As informações são apenas para organização. Não pedimos dados sensíveis como número do cartão ou código de segurança.
                </span>
              </div>
          </div>

          {showCardFields && (
            <div className={styles.cardFields}>
               <h3 className={styles.cardFieldsTitle}>Detalhes do Cartão</h3>
              <input
                type="text"
                placeholder="Apelido do Cartão (Ex: Nubank, Inter)"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required={showCardFields}
                 className={styles.input}
              />
              <input
                type="text"
                placeholder="Bandeira (Ex: Visa, Mastercard)"
                value={cardBrand}
                onChange={(e) => setCardBrand(e.target.value)}
                required={showCardFields}
                 className={styles.input}
              />
              <input
                type="number"
                placeholder="Dia de Fechamento da Fatura"
                value={cardDueDate}
                onChange={(e) => setCardDueDate(e.target.value)}
                required={showCardFields}
                 className={styles.input}
              />
            </div>
          )}

          <button type="submit" className={`${styles.button} ${styles.submitButton}`}>Registrar</button>
        </form>

        <p className={styles.footerText}>
          Já tem uma conta?{' '}
          <Link href="/login" className={styles.link}>
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
