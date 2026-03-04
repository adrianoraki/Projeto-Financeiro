'use client';

import { useState, useEffect } from 'react';
import styles from '../../../styles/TransactionsPage.module.css';
import {
  getTransactionsByOwner,
  updateTransactionStatus,
  Transaction,
} from '../../../lib/transactionService';
import { useAuth } from '../../../lib/AuthContext';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'pending', 'income', 'expense'

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        const data = await getTransactionsByOwner(user.uid);
        setTransactions(data);
        setFilteredTransactions(data);
      } else {
        setTransactions([]);
        setFilteredTransactions([]);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    let result = transactions;
    if (filter === 'paid') {
      result = transactions.filter((t) => t.status === 'paid');
    } else if (filter === 'pending') {
      result = transactions.filter((t) => t.status !== 'paid');
    } else if (filter === 'income') {
      result = transactions.filter((t) => t.type === 'income');
    } else if (filter === 'expense') {
      result = transactions.filter((t) => t.type === 'expense');
    }
    setFilteredTransactions(result);
  }, [filter, transactions]);

  const handleStatusChange = async (id: string, newStatus: 'paid' | 'pending') => {
    await updateTransactionStatus(id, newStatus);
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      )
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Central de Transações</h1>
        <p>Visualize e gerencie todas as suas receitas e despesas.</p>
      </header>

      <div className={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? styles.activeFilter : ''}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('income')}
          className={filter === 'income' ? styles.activeFilter : ''}
        >
          Receitas
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={filter === 'expense' ? styles.activeFilter : ''}
        >
          Despesas
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={filter === 'paid' ? styles.activeFilter : ''}
        >
          Pagas
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? styles.activeFilter : ''}
        >
          Pendentes
        </button>
      </div>

      <div className={styles.transactionList}>
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className={styles.transactionItem}>
            <div className={styles.transactionDetails}>
              <span className={styles.transactionDescription}>
                {transaction.description}
              </span>
              <span
                className={
                  transaction.type === 'income'
                    ? styles.incomeAmount
                    : styles.expenseAmount
                }
              >
                {transaction.type === 'expense' && '-'}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(transaction.amount)}
              </span>
            </div>
            {transaction.type === 'expense' && (
              <div className={styles.transactionStatus}>
                <span>
                  {transaction.status === 'paid' ? 'Paga' : 'Pendente'}
                </span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={transaction.status === 'paid'}
                    onChange={(e) =>
                      handleStatusChange(
                        transaction.id!,
                        e.target.checked ? 'paid' : 'pending'
                      )
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
