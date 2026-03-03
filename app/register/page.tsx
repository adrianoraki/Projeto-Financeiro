
'use client';

import { useState, useEffect } from 'react';
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
      router.push('/dashboard');
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

      if (showCardFields && cardName && cardBrand && cardDueDate) {
        const idToken = await userCredential.user.getIdToken();
        const response = await fetch('/api/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ 
            cardName, 
            cardBrand, 
            cardDueDate: parseInt(cardDueDate, 10)
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Usuário criado, mas falha ao salvar cartão: ${errorData.error}`);
          setTimeout(() => router.push('/dashboard'), 3000);
          return;
        }
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Tente fazer login.');
      } else {
        setError('Falha ao registrar. Verifique os dados e tente novamente.');
      }
      console.error('Registration error: ', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.formContainer}>
        <h1>Criar Conta</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className={styles.optionalActionContainer}>
             <button 
              type="button"
              className={styles.toggleCardButton}
              onClick={() => setShowCardFields(!showCardFields)}
            >
              {showCardFields ? 'Cancelar Cartão' : '+ Adicionar Cartão (Opcional)'}
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
               <h3>Detalhes do Cartão (Opcional)</h3>
              <input
                type="text"
                placeholder="Nome no Cartão"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required={showCardFields}
              />
              <input
                type="text"
                placeholder="Bandeira (Ex: Visa, Mastercard)"
                value={cardBrand}
                onChange={(e) => setCardBrand(e.target.value)}
                required={showCardFields}
              />
              <input
                type="number"
                placeholder="Dia de Vencimento da Fatura"
                value={cardDueDate}
                onChange={(e) => setCardDueDate(e.target.value)}
                required={showCardFields}
              />
            </div>
          )}

          <button type="submit">Registrar</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <p>
          Já tem uma conta?{' '}
          <Link href="/login">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
