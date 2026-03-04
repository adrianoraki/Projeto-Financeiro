
'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/BudgetForm.module.css';
import type { Budget } from '@/types'; // Corrigido: Importando do arquivo de tipos compartilhado

interface Props {
  onSave: (budget: { name: string; category: string; limit: number }) => void;
  onClose: () => void;
  budget?: Budget;
}

const BudgetForm = ({ onSave, onClose, budget }: Props) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setCategory(budget.category);
      setLimit(budget.limit / 100); // Converte centavos para o valor cheio
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, category, limit });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{budget ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome do Orçamento</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Orçamento Mensal"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category">Categoria</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Alimentação"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="limit">Limite de Gasto (R$)</label>
            <input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseFloat(e.target.value))}
              placeholder="500"
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar Orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
