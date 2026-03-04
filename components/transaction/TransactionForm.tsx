
'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/TransactionForm.module.css';
import { Card } from '../../lib/cardService';
import { categories } from '../../lib/categories';
import { useAuth } from '../../lib/AuthContext';
import { TransactionFormInput } from '../../lib/transactionService';

interface TransactionFormProps {
  onSave: (transactionData: Omit<TransactionFormInput, 'uid'>) => void;
  isSaving: boolean;
  error: string | null;
  formType: 'income' | 'expense';
  onClose: () => void;
  selectedDate: string;
  cards: Card[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, isSaving, error, formType, onClose, selectedDate, cards }) => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [subGroupOptions, setSubGroupOptions] = useState<string[]>([]);
  const [cardId, setCardId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (group) {
      const currentCategory = categories[formType];
      setSubGroupOptions(currentCategory[group as keyof typeof currentCategory] || []);
    } else {
      setSubGroupOptions([]);
    }
    setSubGroup('');
  }, [group, formType]);

  useEffect(() => {
    setGroup('');
    setSubGroup('');
  }, [formType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("Você precisa estar logado para salvar uma transação.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setFormError("Por favor, insira um valor válido e positivo.");
        return;
    }

    const transactionData: Omit<TransactionFormInput, 'uid'> = {
      description,
      amount: parsedAmount,
      date: selectedDate,
      type: formType,
      group: group,
      subGroup: subGroup,
      cardId: cardId || undefined,
    };

    onSave(transactionData);
  };

  const currentGroups = categories[formType] || {};

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formField}>
        <label htmlFor="group">Grupo</label>
        <select id="group" value={group} onChange={(e) => setGroup(e.target.value)} required>
          <option value="">Selecione um grupo</option>
          {Object.keys(currentGroups).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className={styles.formField}>
        <label htmlFor="subGroup">Sub-grupo</label>
        <select id="subGroup" value={subGroup} onChange={(e) => setSubGroup(e.target.value)} required disabled={!group}>
          <option value="">Selecione um sub-grupo</option>
          {subGroupOptions.map(sg => <option key={sg} value={sg}>{sg}</option>)}
        </select>
      </div>
      
      <div className={styles.formField}>
        <label htmlFor="amount">Valor</label>
        <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="R$ 0,00" required />
      </div>

      <div className={styles.formField}>
        <label htmlFor="description">Descrição</label>
        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Salário, Supermercado" required />
      </div>

      {formType === 'expense' && cards.length > 0 && (
        <div className={styles.formField}>
            <label htmlFor="card">Cartão de Crédito (Opcional)</label>
            <select id="card" value={cardId} onChange={(e) => setCardId(e.target.value)}>
                <option value="">Nenhum</option>
                {cards.map(card => (
                    <option key={card.id} value={card.id}>{card.cardName} - {card.cardBrand}</option>
                ))}
            </select>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {formError && <p className={styles.error}>{formError}</p>}

      <div className={styles.formActions}>
        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
        <button type="submit" className={styles.saveButton} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
