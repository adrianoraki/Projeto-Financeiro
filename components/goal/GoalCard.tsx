
'use client';

import React, { useState } from 'react';
import styles from '../../styles/GoalCard.module.css';
import { Goal } from '../../lib/goalsService'; // Import the Goal type

interface GoalCardProps {
  goal: Goal | undefined;
  onGoalUpdate: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onGoalUpdate }) => {
  const [amount, setAmount] = useState('');

  const formatCurrency = (value: number | undefined | null) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSaveMoney = async (saveAmountInCents: number) => {
    if (!goal || isNaN(saveAmountInCents) || saveAmountInCents <= 0) return;
    
    // This would ideally be calling a function from a service
    // e.g., addFundsToGoal(goal.id, saveAmountInCents);
    console.log(`Saving ${saveAmountInCents} cents for ${goal.name}`);

    // For now, let's just refresh the data
    onGoalUpdate();
    setAmount('');
  };

  if (!goal) {
    return <div className={styles.goalCard}><p>Carregando meta...</p></div>;
  }

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return (
    <div className={styles.goalCard}>
      <div className={styles.cardHeader}>
        <h3>Meta: {goal.name}</h3>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>
      <div className={styles.goalInfo}>
        <p>{formatCurrency(goal.currentAmount)} / <span>{formatCurrency(goal.targetAmount)}</span></p>
        <p>{progress.toFixed(1)}%</p>
      </div>
      <div className={styles.saveMoneyContainer}>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Guardar (R$)"
          className={styles.saveInput}
        />
        <button onClick={() => handleSaveMoney(parseFloat(amount) * 100)} className={styles.saveButton}>Guardar</button>
      </div>
    </div>
  );
};

export default GoalCard;
