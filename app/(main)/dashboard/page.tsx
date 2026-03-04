
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
// Importa AppTransaction para garantir a consistência do tipo de data
import { AppTransaction, getTransactionsByOwner } from '../../../lib/transactionService'; 
import { Goal } from '../../../lib/goalsService';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import BalanceChart from '../../../components/dashboard/BalanceChart';
import IncomeExpenseChart from '../../../components/dashboard/IncomeExpenseChart';
import ExpensesPieChart from '../../../components/dashboard/ExpensesPieChart';
import GoalCard from '../../../components/goal/GoalCard';
import CdiCard from '../../../components/investments/CdiCard';
import InvestmentCard from '../../../components/investments/InvestmentCard';
import styles from '../../../styles/DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();
  // O estado agora usa AppTransaction para garantir que a data seja sempre uma string
  const [transactions, setTransactions] = useState<AppTransaction[]>([]);

  useEffect(() => {
    if (user) {
      getTransactionsByOwner(user.uid)
        .then(setTransactions) // getTransactionsByOwner agora retorna AppTransaction[]
        .catch(console.error);
    }
  }, [user]);

  // DUMMY DATA
  const goals: Goal[] = [{
    id: '1',
    uid: user?.uid || '1',
    name: 'Viagem para a Praia',
    currentAmount: 75000,
    targetAmount: 100000,
    createdAt: new Date(),
  }];
  const cdiRate = 11.65; 
  const investments = { total: 12500, performance: 5.8 };

  const handleGoalUpdate = () => {
    console.log("Goal update triggered from dashboard.");
  };

  return (
    <div className={styles.container}>
      <DashboardHeader 
        userName={user?.displayName || 'Usuário'} 
        transactions={transactions}
      />
      
      <main className={styles.mainGrid}>
        <section className={`${styles.gridSection} ${styles.balanceArea}`}>
          <BalanceChart transactions={transactions} />
        </section>
        <section className={`${styles.gridSection} ${styles.incomeExpenseArea}`}>
          <IncomeExpenseChart transactions={transactions} />
        </section>
        <section className={`${styles.gridSection} ${styles.pieArea}`}>
          <ExpensesPieChart transactions={transactions} />
        </section>
        <section className={`${styles.gridSection} ${styles.goalsArea}`}>
          <GoalCard goal={goals[0]} onGoalUpdate={handleGoalUpdate} />
        </section>
        <section className={`${styles.gridSection} ${styles.cdiArea}`}>
          <CdiCard cdiRate={cdiRate} />
        </section>
        <section className={`${styles.gridSection} ${styles.investmentsArea}`}>
          <InvestmentCard investments={investments} />
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
