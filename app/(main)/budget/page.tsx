'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import BudgetForm from '@/components/budget/BudgetForm';
import BudgetCard from '@/components/budget/BudgetCard';
import styles from '@/styles/BudgetPage.module.css';
import type { Budget } from '@/types'; // Corrigido: Importando do arquivo de tipos compartilhado

const BudgetPage = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/budget', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar orçamentos');
      }
      const data = await response.json();
      setBudgets(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSaveBudget = async (budgetData: { name: string; category: string; limit: number; }) => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const method = editingBudget ? 'PUT' : 'POST';
      const url = editingBudget ? `/api/budget/${editingBudget.id}` : '/api/budget';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar orçamento');
      }

      setFormOpen(false);
      setEditingBudget(null);
      fetchBudgets(); // Re-fetch budgets after saving
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to save budget:", err);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/budget/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao deletar orçamento');
      }

      fetchBudgets(); // Re-fetch budgets after deleting
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to delete budget:", err);
    }
  };

  const handleAddNew = () => {
    setEditingBudget(null);
    setFormOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Orçamentos</h1>
        <p>Crie e gerencie seus orçamentos para controlar seus gastos.</p>
        <button onClick={handleAddNew} className={styles.addButton}>
          Adicionar Novo Orçamento
        </button>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {isFormOpen && (
        <BudgetForm
          onSave={handleSaveBudget}
          onClose={() => setFormOpen(false)}
          budget={editingBudget || undefined}
        />
      )}

      <div className={styles.budgetList}>
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={() => handleEditBudget(budget)}
            onDelete={() => handleDeleteBudget(budget.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetPage;
