
'use client';

import styles from '../styles/TransactionModal.module.css';
import TransactionForm from './TransactionForm';
import { Card } from '../lib/cardService';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  group: string;
  subGroup: string;
  cardName?: string;
  cardBrand?: string;
  cardId?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  selectedDate: string;
  showForm: boolean;
  formType: 'income' | 'expense';
  onSave: (transaction: any) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  setShowForm: (show: boolean) => void;
  cards: Card[];
  onCardAdd: (newCard: Omit<Card, 'id' | 'uid'>) => Promise<void>;
  isLoading?: boolean;
}

const TransactionModal = ({
  isOpen, onClose, transactions, selectedDate, showForm,
  formType, onSave, isSaving, error, setShowForm,
  cards, onCardAdd, isLoading
}: TransactionModalProps) => {
  if (!isOpen) return null;

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{showForm ? 'Adicionar Transação' : `Transações de ${formattedDate}`}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>

        {showForm ? (
          <TransactionForm
            selectedDate={selectedDate}
            onSave={onSave}
            onClose={() => setShowForm(false)}
            initialType={formType}
            isSaving={isSaving}
            error={error}
            styles={styles}
            cards={cards}
            onCardAdd={onCardAdd}
            isLoading={isLoading}
          />
        ) : (
          <div className={styles.transactionsList}>
            {transactions && transactions.length > 0 ? (
              transactions.map(t => (
                <div key={t.id} className={styles.transactionItem} data-type={t.type}>
                  <div>
                    <span className={styles.transactionDescription}>{t.description || 'Transação sem descrição'}</span>
                    <span className={styles.transactionCategory}>
                      {t.group} &gt; {t.subGroup}
                      {t.subGroup === 'Cartão de Crédito' && t.cardName && (
                        <span className={styles.cardDetails}>
                          {` (${t.cardName} - ${t.cardBrand})`}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className={t.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
                    {t.type === 'expense' ? '− ' : '+ '}{t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.noTransactions}>Nenhuma transação neste dia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
