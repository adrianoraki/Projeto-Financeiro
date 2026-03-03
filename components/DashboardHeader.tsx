
'use client';

import { useMemo } from 'react';
import styles from '../styles/DashboardHeader.module.css';

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
}

interface DashboardHeaderProps {
  userName: string;
  transactions: Transaction[];
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const DashboardHeader = ({ userName, transactions, onAddIncome, onAddExpense }: DashboardHeaderProps) => {

  // Lógica de cálculo dos totais com verificação de segurança
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    // Se 'transactions' não for um array (ex: undefined no carregamento inicial), retorna zero.
    if (!Array.isArray(transactions)) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  // Função para formatar valores como moeda (mantendo o fallback por segurança)
  const formatCurrency = (value: number | undefined | null) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.welcome}>
        <h1>Olá, {userName}!</h1>
        <p>Bem-vindo(a) de volta ao seu controle financeiro.</p>
      </div>

      <div className={styles.summaryCards}>
        <div className={`${styles.card} ${styles.incomeCard}`}>
          <h4>Receitas Totais</h4>
          <p className={styles.income}>{formatCurrency(totalIncome)}</p>
        </div>
        <div className={`${styles.card} ${styles.expenseCard}`}>
          <h4>Despesas Totais</h4>
          <p className={styles.expense}>{formatCurrency(totalExpenses)}</p>
        </div>
        <div className={styles.card}>
          <h4>Saldo Atual</h4>
          <p>{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onAddIncome} className={`${styles.button} ${styles.incomeButton}`}>
          + Adicionar Receita
        </button>
        <button onClick={onAddExpense} className={`${styles.button} ${styles.expenseButton}`}>
          - Adicionar Despesa
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
