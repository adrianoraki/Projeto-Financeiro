
'use client';

import { useState } from 'react';
import { Goal, updateGoal } from '../lib/goalsService';
import AddMoneyModal from './AddMoneyModal'; // Importando o novo modal
import styles from '../styles/GoalCard.module.css';

interface GoalCardProps {
  goal: Goal;
  onGoalUpdate: () => void; // Callback para atualizar a lista de metas
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onGoalUpdate }) => {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSaveMoney = async (amount: number) => {
    const newCurrentAmount = goal.currentAmount + amount;
    if (goal.id) {
      await updateGoal(goal.id, { currentAmount: newCurrentAmount });
      onGoalUpdate(); // Dispara a atualização na página pai
      setIsAddMoneyModalOpen(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{goal.name}</h3>
      </div>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.amounts}>
        <div className={styles.amount}>
          <span className={styles.label}>Alcançado</span>
          <span className={styles.value}>{formatCurrency(goal.currentAmount)}</span>
        </div>
        <div className={styles.amount}>
          <span className={styles.label}>Meta</span>
          <span className={styles.value}>{formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={() => setIsAddMoneyModalOpen(true)} className={styles.actionButton}>+ Adicionar Dinheiro</button>
      </div>

      {isAddMoneyModalOpen && (
        <AddMoneyModal 
          onClose={() => setIsAddMoneyModalOpen(false)}
          onSave={handleSaveMoney}
        />
      )}
    </div>
  );
};

export default GoalCard;
