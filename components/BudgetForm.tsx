
'use client';

import { useState } from 'react';
import styles from '../styles/BudgetForm.module.css'; // Using the new stylesheet

interface Props {
  onSave: (budget: { category: string; limit: number }) => void;
  onClose: () => void;
}

const BudgetForm = ({ onSave, onClose }: Props) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ category, limit });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Novo Orçamento</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="limit">Limite de Gasto</label>
            <input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseFloat(e.target.value))}
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
