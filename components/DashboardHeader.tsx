
'use client';

import styles from '../styles/DashboardHeader.module.css';

// Definindo a interface para as props do componente
interface DashboardHeaderProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  totalIncome, 
  totalExpenses, 
  balance, 
  onAddIncome, 
  onAddExpense 
}) => {
  // Função para formatar valores como moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h4>Receitas Totais</h4>
          <p className={styles.income}>{formatCurrency(totalIncome)}</p>
        </div>
        <div className={styles.card}>
          <h4>Despesas Totais</h4>
          <p className={styles.expense}>{formatCurrency(totalExpenses)}</p>
        </div>
        <div className={styles.card}>
          <h4>Saldo Atual</h4>
          <p className={styles.balance}>{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onAddIncome} className={`${styles.button} ${styles.incomeButton}`}>
          + Adicionar Receita
        </button>
        <button onClick={onAddExpense} className={`${styles.button} ${styles.expenseButton}`}>
          + Adicionar Despesa
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
