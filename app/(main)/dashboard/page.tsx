
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { db } from '../../../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { getBudgets } from '../../../lib/budgetService';
import { addTransaction } from '../../../lib/transactionService';
import { processRecurringTransactions } from '../../../lib/recurringService';
import styles from '../../../styles/DashboardPage.module.css';
import DashboardHeader from '../../../components/DashboardHeader';
import IncomeExpenseChart from '../../../components/IncomeExpenseChart';
import BalanceChart from '../../../components/BalanceChart';
import TransactionForm from '../../../components/TransactionForm';

const DashboardPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      processRecurringTransactions(user.uid);

      const q = query(collection(db, 'transactions'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData: any[] = [];
        querySnapshot.forEach((doc) => {
          transactionsData.push({ ...doc.data(), id: doc.id });
        });
        setTransactions(transactionsData);
      });

      const fetchBudgets = async () => {
        const userBudgets = await getBudgets(user.uid);
        setBudgets(userBudgets);
      };
      fetchBudgets();

      return () => unsubscribe();
    }
  }, [user]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
  }, [transactions]);

  const handleAddIncome = () => {
    setFormType('income');
    setShowForm(true);
  };

  const handleAddExpense = () => {
    setFormType('expense');
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSaveError(null);
  };

  const handleSaveTransaction = async (transaction: {
    description: string;
    amount: number;
    totalAmount?: number;
    category: string;
    installments?: number;
    budgetId?: string;
  }) => {
    if (!user) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const { installments = 1, category, description, amount } = transaction;

      if (category === 'Cartão' && installments > 1) {
        for (let i = 0; i < installments; i++) {
          const installmentDate = new Date();
          installmentDate.setMonth(installmentDate.getMonth() + i);

          await addTransaction({
            ...transaction,
            amount: amount, // Valor da parcela
            description: `${description} (${i + 1}/${installments})`,
            uid: user.uid,
            type: formType,
            date: installmentDate.toISOString().split('T')[0],
            installmentNumber: i + 1,
            totalInstallments: installments,
          });
        }
      } else {
        await addTransaction({
          ...transaction,
          uid: user.uid,
          type: formType,
          date: new Date().toISOString().split('T')[0],
        });
      }

      const userBudgets = await getBudgets(user.uid);
      setBudgets(userBudgets);
      handleCloseForm(); // Fecha o formulário apenas em caso de sucesso

    } catch (error) {
      console.error('Falha ao salvar transação:', error);
      setSaveError('Não foi possível salvar a transação. Verifique as permissões do banco de dados (regras de segurança) e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <DashboardHeader
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        onAddIncome={handleAddIncome}
        onAddExpense={handleAddExpense}
      />

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h3>Receitas vs Despesas (Mensal)</h3>
          <IncomeExpenseChart transactions={transactions} />
        </div>
        <div className={styles.chartContainer}>
          <h3>Evolução do Patrimônio</h3>
          <BalanceChart transactions={transactions} />
        </div>
      </div>

      {showForm && (
        <TransactionForm
          type={formType}
          onClose={handleCloseForm}
          onSave={handleSaveTransaction}
          budgets={budgets}
          isSaving={isSaving}
          error={saveError}
        />
      )}
    </div>
  );
};

export default DashboardPage;
