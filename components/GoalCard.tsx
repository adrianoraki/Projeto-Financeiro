
'use client';

import { useState } from 'react';
import styles from '../styles/GoalCard.module.css';

// Tipagem para o objeto da meta
interface Goal {
  title: string;
  current: number;
  goal: number;
}

interface GoalCardProps {
  goal: Goal | undefined; // A propriedade pode ser indefinida
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const [amount, setAmount] = useState('');

  // Função de formatação de moeda robusta
  const formatCurrency = (value: number | undefined | null) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSaveMoney = async (saveAmount: number) => {
    if (!goal || saveAmount <= 0) return;
    // Lógica para atualizar a meta (ex: chamar uma API ou atualizar o estado global)
    console.log(`Saving ${saveAmount} for ${goal.title}`);
    setAmount('');
  };

  // Verificação de segurança: Se a meta não existir, não renderiza nada ou um placeholder
  if (!goal) {
    // Pode retornar null ou um componente de "loading"
    return <div className={styles.goalCard}> <p>Carregando meta...</p> </div>;
  }

  const progress = (goal.current / goal.goal) * 100;

  return (
    <div className={styles.goalCard}>
      <div className={styles.cardHeader}>
        <h3>Meta: {goal.title}</h3>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>
      <div className={styles.goalInfo}>
        <p>{formatCurrency(goal.current)} / <span>{formatCurrency(goal.goal)}</span></p>
        <p>{progress.toFixed(1)}%</p>
      </div>
      <div className={styles.saveMoneyContainer}>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Guardar dinheiro"
          className={styles.saveInput}
        />
        <button onClick={() => handleSaveMoney(parseFloat(amount))} className={styles.saveButton}>Guardar</button>
      </div>
    </div>
  );
};

export default GoalCard;
