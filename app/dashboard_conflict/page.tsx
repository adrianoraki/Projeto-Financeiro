
import React from 'react';
import styles from '../../styles/DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.welcomeMessage}>
        <h1>Bem-vindo de volta!</h1>
        <p>Aqui está um resumo rápido da sua saúde financeira.</p>
      </div>

      {/* Cards de Resumo - Placeholder */}
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>Saldo Atual</h3>
          <p className={styles.balance}>R$ 12.345,67</p>
        </div>
        <div className={styles.card}>
          <h3>Receitas do Mês</h3>
          <p className={styles.income}>R$ 7.890,12</p>
        </div>
        <div className={styles.card}>
          <h3>Despesas do Mês</h3>
          <p className={styles.expense}>R$ 4.567,89</p>
        </div>
        <div className={styles.card}>
          <h3>Meta de Economia</h3>
          <p className={styles.savings}>R$ 500,00 / R$ 1.000,00</p>
        </div>
      </div>

      {/* Placeholder para futuros gráficos ou listas */}
      <div className={styles.placeholder}>
        <p>Gráficos e transações recentes aparecerão aqui em breve.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
