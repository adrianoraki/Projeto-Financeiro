
'use client';

import styles from '@/styles/BudgetCard.module.css';
import type { Budget } from '@/types'; // Corrigido: Importando do arquivo de tipos compartilhado

interface Props {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
}

const BudgetCard = ({ budget, onEdit, onDelete }: Props) => {
  const { limit, spent } = budget; // Removido 'category' que não estava sendo usado
  const progress = (spent / limit) * 100;

  const getProgressBarColor = () => {
    if (progress > 85) return '#EF4444'; // Vermelho
    if (progress > 60) return '#F59E0B'; // Âmbar
    return '#10B981'; // Verde
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{budget.name}</h3> {/* Alterado de category para name para consistência */}
        <div className={styles.limit}>Limite: R$ {(limit / 100).toFixed(2).replace('.', ',')}</div>
      </div>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress > 100 ? 100 : progress}%`, backgroundColor: getProgressBarColor() }}
        ></div>
      </div>
      <div className={styles.amounts}>
        <span>Gasto: R$ {(spent / 100).toFixed(2).replace('.', ',')}</span>
        <span className={styles.remaining}>Restante: R$ {((limit - spent) / 100).toFixed(2).replace('.', ',')}</span>
      </div>
      <div className={styles.cardActions}>
        <button onClick={onEdit} className={styles.editButton}>Editar</button>
        <button onClick={onDelete} className={styles.deleteButton}>Deletar</button>
      </div>
    </div>
  );
};

export default BudgetCard;
