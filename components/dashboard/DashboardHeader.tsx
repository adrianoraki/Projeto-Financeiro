
'use client';

import { useMemo } from 'react';
import styles from '../../styles/DashboardHeader.module.css';
import { fromCents } from '../../lib/currencyUtils'; // Importando funções de conversão

interface Transaction {
  type: 'income' | 'expense';
  amount: number; // Continuamos recebendo em centavos do serviço
}

interface DashboardHeaderProps {
  userName: string;
  transactions: Transaction[];
}

// REMOVIDO: onAddIncome e onAddExpense não são mais necessários
const DashboardHeader = ({ userName, transactions }: DashboardHeaderProps) => {

  // A lógica de cálculo agora usa centavos internamente
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    if (!Array.isArray(transactions)) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }

    const incomeInCents = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expensesInCents = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncome: incomeInCents,
      totalExpenses: expensesInCents,
      balance: incomeInCents - expensesInCents,
    };
  }, [transactions]);

  // A formatação agora converte de centavos para reais
  const formatCurrency = (valueInCents: number) => {
    const valueInReais = fromCents(valueInCents);
    return valueInReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

      {/* REMOVIDO: Seção de botões de ação */}
    </header>
  );
};

export default DashboardHeader;
