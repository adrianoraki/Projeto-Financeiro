
'use client';

import React, { useState } from 'react';
import styles from '@/styles/RecurringForm.module.css';
import type { Budget } from '@/types'; // Corrigido: Importando do arquivo de tipos compartilhado

// A interface agora usa o tipo Budget importado.
export interface RecurringTransactionData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'Diária' | 'Semanal' | 'Mensal';
  date: string;
  budgetId: string | null;
}

interface RecurringFormProps {
  onClose: () => void;
  onSave: (recurringTransaction: Omit<RecurringTransactionData, 'id'>) => void;
  budgets: Budget[];
}

const RecurringForm: React.FC<RecurringFormProps> = ({ onClose, onSave, budgets }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState<'Diária' | 'Semanal' | 'Mensal'>('Mensal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [budgetId, setBudgetId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description,
      amount: parseFloat(amount),
      type,
      category,
      frequency,
      date,
      budgetId: type === 'expense' ? budgetId : null,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Nova Transação Recorrente</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>

          {type === 'expense' && (
            <select value={budgetId} onChange={(e) => setBudgetId(e.target.value)} required>
              <option value="">Selecione um Orçamento</option>
              {budgets.map(budget => (
                <option key={budget.id} value={budget.id}>{budget.name}</option>
              ))}
            </select>
          )}

          <select value={frequency} onChange={(e) => setFrequency(e.target.value as 'Diária' | 'Semanal' | 'Mensal')}>
            <option value="Diária">Diária</option>
            <option value="Semanal">Semanal</option>
            <option value="Mensal">Mensal</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className={styles.buttonsContainer}>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringForm;
