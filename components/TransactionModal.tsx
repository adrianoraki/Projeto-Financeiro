
'use client';

import styles from '../styles/TransactionModal.module.css';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  selectedDate: string;
}

const TransactionModal = ({ isOpen, onClose, transactions, selectedDate }: TransactionModalProps) => {
  if (!isOpen) return null;

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}> 
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Transações de {formattedDate}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.transactionsList}>
          {transactions && transactions.length > 0 ? (
            transactions.map(t => (
              <div key={t.id} className={styles.transactionItem}>
                <span>{t.description || 'Transação sem descrição'}</span>
                <span className={t.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
                  {t.type === 'expense' ? '-' : '+'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))
          ) : (
            <p className={styles.noTransactions}>Nenhuma transação neste dia.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
