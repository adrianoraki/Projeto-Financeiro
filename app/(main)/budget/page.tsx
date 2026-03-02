
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import styles from '../../../styles/BudgetPage.module.css';
import BudgetCard from '../../../components/BudgetCard';
import BudgetForm from '../../../components/BudgetForm';
import { addBudget, getBudgets } from '../../../lib/budgetService';

const BudgetPage = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user) {
        try {
          const userBudgets = await getBudgets(user.uid);
          setBudgets(userBudgets);
        } catch (error) {
          console.error("Failed to fetch budgets: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBudgets();
  }, [user]);

  const handleSaveBudget = async (newBudget: { category: string; limit: number }) => {
    if (user) {
      try {
        await addBudget(user.uid, newBudget.category, newBudget.limit);
        // Refetch budgets to display the new one
        const userBudgets = await getBudgets(user.uid);
        setBudgets(userBudgets);
        setShowForm(false);
      } catch (error) {
        console.error("Failed to save budget: ", error);
      }
    }
  };

  if (loading || !user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Orçamento Mensal</h1>
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          + Novo Orçamento
        </button>
      </header>

      {showForm && (
        <BudgetForm 
          onSave={handleSaveBudget} 
          onClose={() => setShowForm(false)} 
        />
      )}

      <div className={styles.budgetGrid}>
        {budgets.length === 0 ? (
          <p>Você ainda não tem nenhuma categoria de orçamento cadastrada.</p>
        ) : (
          budgets.map(budget => <BudgetCard key={budget.id} budget={budget} />)
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
