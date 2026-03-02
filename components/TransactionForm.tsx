'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/TransactionForm.module.css';
import { getCards, CreditCard } from '../lib/cardsService';
import { useAuth } from '../lib/AuthContext'; // Importe o useAuth

interface TransactionFormProps {
  onSave: (transaction: any) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onClose }) => {
  const { user } = useAuth(); // Obtenha o usuário do contexto
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Outros');
  const [paymentMethod, setPaymentMethod] = useState('Outros');
  const [installments, setInstallments] = useState(1);
  const [isIncome, setIsIncome] = useState(false);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedCard, setSelectedCard] = useState('');

  useEffect(() => {
    setIsIncome(type === 'income');
  }, [type]);

  useEffect(() => {
    if (user) {
      const fetchCards = async () => {
        const userCards = await getCards(user.uid);
        setCards(userCards);
      };
      fetchCards();
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description,
      amount: parseFloat(amount),
      type,
      date,
      category,
      paymentMethod,
      installments: Number(installments),
      cardId: selectedCard, // Adicione o cardId
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isIncome ? 'Adicionar Receita' : 'Adicionar Despesa'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.typeSwitch}>
            <button
              type="button"
              className={`${styles.switchButton} ${!isIncome ? styles.active : ''}`}
              onClick={() => setType('expense')}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`${styles.switchButton} ${isIncome ? styles.active : ''}`}
              onClick={() => setType('income')}
            >
              Receita
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="amount">Valor</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="R$ 0,00"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="date">Data</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Casa</option>
                <option>Comida</option>
                <option>Transporte</option>
                <option>Lazer</option>
                <option>Saúde</option>
                <option>Outros</option>
              </select>
            </div>

            {!isIncome && (
              <div className={styles.formGroup}>
                <label htmlFor="paymentMethod">Método de Pagamento</label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>PIX</option>
                  <option>Cartão de Crédito</option>
                  <option>Boleto</option>
                  <option>Outros</option>
                </select>
              </div>
            )}
          </div>

          {paymentMethod === 'Cartão de Crédito' && !isIncome && (
            <div className={styles.formGroup}>
              <label htmlFor="card">Cartão</label>
              <select
                id="card"
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                required
              >
                <option value="">Selecione um cartão</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id}>{card.name}</option>
                ))}
              </select>
            </div>
          )}

          {!isIncome && (
            <div className={styles.formGroup}>
              <label htmlFor="installments">Parcelas</label>
              <input
                id="installments"
                type="number"
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                min="1"
              />
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
            <button type="submit" className={`${styles.saveButton} ${isIncome ? styles.income : styles.expense}`}>
              {isIncome ? 'Adicionar Receita' : 'Adicionar Despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
