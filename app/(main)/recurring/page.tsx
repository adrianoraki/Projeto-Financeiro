'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/RecurringPage.module.css';
import RecurringForm from '@/components/recurring/RecurringForm';
import type { RecurringTransactionData } from '@/components/recurring/RecurringForm';
import { useAuth } from '@/lib/AuthContext';
import type { Budget, RecurringTransaction } from '@/types'; // Corrigido: Importando do arquivo de tipos compartilhado

const RecurringPage = () => {
  const { user } = useAuth();
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${idToken}` };

      // Buscar transações recorrentes
      const recurringRes = await fetch('/api/recurring', { headers });
      if (!recurringRes.ok) throw new Error('Falha ao buscar transações recorrentes');
      const recurringData = await recurringRes.json();
      setRecurringTransactions(recurringData);

      // Buscar orçamentos
      const budgetRes = await fetch('/api/budget', { headers });
      if (!budgetRes.ok) throw new Error('Falha ao buscar orçamentos');
      const budgetData = await budgetRes.json();
      setBudgets(budgetData);

    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveRecurring = async (formData: RecurringTransactionData) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar transação recorrente');
      }

      setShowForm(false);
      fetchData(); // Re-fetch all data
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Transações Recorrentes</h1>
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          + Nova Recorrência
        </button>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {showForm && (
        <RecurringForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveRecurring}
          budgets={budgets} // Agora `budgets` tem o tipo correto
        />
      )}

      <div className={styles.listContainer}>
        {recurringTransactions.length === 0 ? (
          <p>Você ainda não tem nenhuma transação recorrente cadastrada.</p>
        ) : (
          <ul className={styles.list}>
            {recurringTransactions.map(transaction => (
              <li key={transaction.id} className={styles.listItem}>
                <span>{transaction.description}</span>
                <span className={transaction.type === 'income' ? styles.income : styles.expense}>
                  R$ {(transaction.amount / 100).toFixed(2).replace('.', ',')}
                </span>
                <span>{transaction.frequency}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecurringPage;
