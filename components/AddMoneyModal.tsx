
'use client';

import { useState } from 'react';
import styles from '../styles/GoalForm.module.css'; // Reutilizando os estilos do formulário de metas

interface AddMoneyModalProps {
  onClose: () => void;
  onSave: (amount: number) => void;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAmount = parseFloat(amount);
    if (!isNaN(newAmount) && newAmount > 0) {
      onSave(newAmount);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Adicionar Dinheiro</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Valor a Adicionar</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="R$ 0,00"
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyModal;
