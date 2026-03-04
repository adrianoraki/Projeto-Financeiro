
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { addTransaction } from '../../lib/transactionService';
import styles from '../../styles/NewTransactionPage.module.css';

const NewTransactionPage = () => {
  const { user } = useAuth();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar logado para adicionar uma transação.");
      return;
    }

    setError('');
    setSuccess('');

    try {
      await addTransaction({
        uid: user.uid,
        type: type as 'income' | 'expense',
        amount: parseFloat(amount),
        description,
        group: category, // Passando 'category' como 'group'
        subGroup: 'N/A', // Valor padrão para sub-grupo
        date,
      });
      setSuccess(`Sua ${type === 'income' ? 'receita' : 'despesa'} foi adicionada com sucesso!`);
      // Limpar formulário
      setAmount('');
      setDescription('');
      setCategory('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao salvar a transação.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Adicionar Nova Transação</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        
        <div className={styles.typeSelector}>
          <button type="button" className={`${styles.typeButton} ${type === 'expense' ? styles.active : ''}`} onClick={() => setType('expense')}>Despesa</button>
          <button type="button" className={`${styles.typeButton} ${type === 'income' ? styles.active : ''}`} onClick={() => setType('income')}>Receita</button>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="amount">Valor (R$)</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Descrição</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="category">Categoria</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="date">Data</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <button type="submit" className={styles.submitButton}>Adicionar Transação</button>
      </form>
    </div>
  );
};

export default NewTransactionPage;
