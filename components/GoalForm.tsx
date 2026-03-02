
'use client';

import { useState } from 'react';
import { Goal } from '../lib/goalsService';
import styles from '../styles/GoalForm.module.css';

interface GoalFormProps {
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      uid: '', // Add a dummy uid to satisfy the type
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Nova Meta</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome da Meta</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="targetAmount">Valor Alvo</label>
            <input 
              type="number" 
              id="targetAmount" 
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="currentAmount">Valor Inicial (Opcional)</label>
            <input 
              type="number" 
              id="currentAmount" 
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
