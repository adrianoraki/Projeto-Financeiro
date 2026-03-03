
'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/TransactionForm.module.css';
import { Card } from '../lib/cardService';
import { categories } from '../lib/categories';

interface TransactionFormProps {
  onSave: (transactionData: any) => void;
  isSaving: boolean;
  error: string | null;
  formType: 'income' | 'expense';
  onClose: () => void;
  selectedDate: string;
  cards: Card[];
}

const TransactionForm = ({ onSave, isSaving, error, formType, onClose, selectedDate, cards }: TransactionFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [subGroupOptions, setSubGroupOptions] = useState<string[]>([]);
  const [cardId, setCardId] = useState('');

  useEffect(() => {
    if (group) {
      const options = categories[formType][group] || [];
      setSubGroupOptions(options);
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
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date: selectedDate,
      type: formType,
      group,
      subGroup,
      cardId,
    };
    onSave(transactionData);
  };

  const currentGroups = categories[formType] || {};

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formField}>
        <label htmlFor="description">Descrição</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Salário, Supermercado"
          required
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="amount">Valor</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          required
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="group">Grupo</label>
        <select id="group" value={group} onChange={(e) => setGroup(e.target.value)} required>
          <option value="">Selecione um grupo</option>
          {Object.keys(currentGroups).map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className={styles.formField}>
        <label htmlFor="subGroup">Sub-grupo</label>
        <select id="subGroup" value={subGroup} onChange={(e) => setSubGroup(e.target.value)} required disabled={!group}>
          <option value="">Selecione um sub-grupo</option>
          {subGroupOptions.map(sg => (
            <option key={sg} value={sg}>{sg}</option>
          ))}\
        </select>
      </div>
      
      {formType === 'expense' && cards.length > 0 && (
        <div className={styles.formField}>
            <label htmlFor="card">Cartão de Crédito (Opcional)</label>
            <select id="card" value={cardId} onChange={(e) => setCardId(e.target.value)}>
                <option value="">Nenhum</option>
                {cards.map(card => (
                    <option key={card.id} value={card.id}>{card.name} - **** {card.last4Digits}</option>
                ))}
            </select>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

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
