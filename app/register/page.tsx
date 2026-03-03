'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from '../../styles/Auth.module.css';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.tooltipIcon}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c0-.662.538-1.2 1.2-1.2s1.2.538 1.2 1.2v5.25c0 .662-.538 1.2-1.2 1.2s-1.2-.538-1.2-1.2V10.558zM12 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cardNickname, setCardNickname] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardFlag, setCardFlag] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      
      if (showCardForm && cardNickname) {
        await addDoc(collection(db, 'cards'), {
          uid: user.uid,
          name: cardNickname,
          brand: bankName || 'Não especificado',
          invoiceDueDate: Number(expiryDate) || 1,
          createdAt: serverTimestamp(),
        });
      }

      setSuccessMessage('Cadastro realizado com sucesso! Você já pode fazer login.');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Tente fazer login.');
      } else {
        setError('Falha ao registrar. Verifique os dados e tente novamente.');
      }
      console.error('Registration error: ', error);
    }
  };

  if (successMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.backgroundImage} />
        <div className={styles.formContainer}>
          <h1>Cadastro Concluído</h1>
          <p className={styles.success}>{successMessage}</p>
          <Link href="/login" className={styles.linkButton}>Ir para Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} />
      <div className={styles.formContainer}>
        <h1>Criar Conta</h1>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          
          {!showCardForm ? (
            <div className={styles.optionalButtonContainer}>
              <button type="button" onClick={() => setShowCardForm(true)} className={styles.optionalButton}>+ Adicionar primeiro cartão (Opcional)</button>
              <div className={styles.tooltipContainer}>
                <InfoIcon />
                <span className={styles.tooltipText}>
                  Fique tranquilo! As informações são apenas para organização. Não pedimos dados sensíveis como número do cartão ou código de segurança.
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.cardForm}>
              <h3>Detalhes do Cartão (Opcional)</h3>
              <input type="text" placeholder="Apelido do Cartão (ex: Inter, Nubank)" value={cardNickname} onChange={(e) => setCardNickname(e.target.value)} />
              <input type="text" placeholder="Nome do Banco" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              <select value={cardFlag} onChange={(e) => setCardFlag(e.target.value)}>
                  <option value="">Selecione a Bandeira</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Elo">Elo</option>
                  <option value="American Express">American Express</option>
                  <option value="Outra">Outra</option>
              </select>
              <input type="text" placeholder="Dia do Vencimento da Fatura" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          )}
          
          <button type="submit">Registrar</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        <p>
          Já tem uma conta?{' '}
          <Link href="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
}
