
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { addTransaction, getTransactionsByOwner, AppTransaction, TransactionFormInput } from '../../lib/transactionService';
import { getCardsByOwner, Card } from '../../lib/cardService';
import TransactionForm from './TransactionForm';
import styles from '../../styles/TransactionModal.module.css';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: () => void;
  selectedDate?: string;
}

const TransactionModal = ({
  isOpen,
  onClose,
  onTransactionAdded,
  selectedDate
}: TransactionModalProps) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [transactions, setTransactions] = useState<AppTransaction[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveDate = selectedDate || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen && user) {
      if (selectedDate) {
        getTransactionsByOwner(user.uid).then(allTransactions => {
          const dayTransactions = allTransactions.filter(t => t.date === selectedDate);
          setTransactions(dayTransactions);
        }).catch(console.error);
      } else {
        setShowForm(true);
      }
      getCardsByOwner(user.uid).then(setCards).catch(console.error);
    }
    if (!isOpen) {
      setShowForm(false);
      setTransactions([]);
      setError(null);
    }
  }, [isOpen, user, selectedDate]);

  const handleSave = async (formData: Omit<TransactionFormInput, 'uid'>) => {
    if (!user) {
      setError("Você precisa estar logado para adicionar uma transação.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const transactionData: TransactionFormInput = {
        ...formData,
        uid: user.uid,
      };
      await addTransaction(transactionData);
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setFormType(type);
    setShowForm(true);
  };

  if (!isOpen) return null;

  const formattedDate = new Date(effectiveDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const headerText = showForm
    ? `Adicionar ${formType === 'income' ? 'Receita' : 'Despesa'}`
    : `Transações de ${formattedDate}`;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{headerText}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>

        {showForm ? (
          <TransactionForm
            formType={formType}
            selectedDate={effectiveDate}
            onSave={handleSave}
            onClose={() => selectedDate ? setShowForm(false) : onClose()}
            isSaving={isSaving}
            error={error}
            cards={cards}
          />
        ) : (
          <>
            <div className={styles.transactionsList}>
              {transactions.length > 0 ? (
                transactions.map(t => (
                  <div key={t.id} className={styles.transactionItem} data-type={t.type}>
                    <div>
                      <span className={styles.transactionDescription}>{t.description}</span>
                      <span className={styles.transactionCategory}>{t.category}</span>
                    </div>
                    <span className={t.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
                      {t.type === 'expense' ? '− ' : '+ '}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.noTransactions}>Nenhuma transação neste dia.</p>
              )}
            </div>
            <div className={styles.addButtonsContainer}>
              <button onClick={() => handleAddTransaction('income')} className={`${styles.addButton} ${styles.incomeButton}`}>
                Adicionar Receita
              </button>
              <button onClick={() => handleAddTransaction('expense')} className={`${styles.addButton} ${styles.expenseButton}`}>
                Adicionar Despesa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
