'use client';

import { useState } from 'react';
import styles from '../styles/CardForm.module.css';

interface CardFormProps {
  onSave: (card: { name: string; brand: string; invoiceDueDate: number; }) => void;
  onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Visa');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, brand, invoiceDueDate: Number(invoiceDueDate) });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Adicionar Cartão</h2>
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>Apelido do Cartão</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Cartão Principal" required />
            </div>

            <div className={styles.formGroup}>
                <label>Bandeira</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Elo">Elo</option>
                    <option value="American Express">American Express</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Dia do Vencimento da Fatura</label>
                <input 
                  type="number" 
                  value={invoiceDueDate} 
                  onChange={(e) => setInvoiceDueDate(e.target.value)} 
                  min="1" 
                  max="31" 
                  placeholder="Ex: 15"
                  required 
                />
            </div>

            <div className={styles.formActions}>
                <button type="button" onClick={onClose}>Cancelar</button>
                <button type="submit">Salvar</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
