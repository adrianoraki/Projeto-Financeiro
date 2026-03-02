
'use client';

import styles from '../styles/BudgetCard.module.css';

interface Props {
  budget: {
    id: string;
    category: string;
    limit: number;
    spent: number;
  };
}

const BudgetCard = ({ budget }: Props) => {
  const { category, limit, spent } = budget;
  const progress = (spent / limit) * 100;

  const getProgressBarColor = () => {
    if (progress > 85) return '#EF4444'; // Vermelho
    if (progress > 60) return '#F59E0B'; // Âmbar
    return '#10B981'; // Verde
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{category}</h3>
        <span className={styles.limit}>Limite: R$ {limit.toFixed(2)}</span>
      </div>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progress > 100 ? 100 : progress}%`, backgroundColor: getProgressBarColor() }}
        ></div>
      </div>
      <div className={styles.amounts}>
        <span>Gasto: R$ {spent.toFixed(2)}</span>
        <span className={styles.remaining}>Restante: R$ {(limit - spent).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BudgetCard;
