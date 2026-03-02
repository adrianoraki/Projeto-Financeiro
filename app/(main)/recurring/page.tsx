
'use client';

import { useState, useEffect } from 'react';
import styles from '../../../styles/RecurringPage.module.css';
import RecurringForm from '../../../components/RecurringForm';
import { useAuth } from '../../../lib/AuthContext';
import { addRecurringTransaction, getRecurringTransactions } from '../../../lib/recurringService';
import { getBudgets } from '../../../lib/budgetService';

const RecurringPage = () => {
  const { user } = useAuth();
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const recurring = await getRecurringTransactions(user.uid);
        const budgetData = await getBudgets(user.uid);
        setRecurringTransactions(recurring);
        setBudgets(budgetData);
      };
      fetchData();
    }
  }, [user]);

  const handleSaveRecurring = async (newRecurring: any) => {
    if (user) {
      await addRecurringTransaction({ ...newRecurring, uid: user.uid });
      // Refetch to show the new item
      const recurring = await getRecurringTransactions(user.uid);
      setRecurringTransactions(recurring);
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

      {showForm && (
        <RecurringForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveRecurring}
          budgets={budgets}
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
                  R$ {transaction.amount.toFixed(2)}
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
