'use client';

import React, { useState } from 'react';
import styles from '../styles/CardForm.module.css';

interface CardFormProps {
  onSave: (card: { name: string; brand: string; invoiceDueDate: number; }) => void;
  onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Visa');
  const [otherBrand, setOtherBrand] = useState(''); // State for the custom brand
  const [invoiceDueDate, setInvoiceDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If brand is 'Outros', use the custom brand name, otherwise use the selected brand
    const finalBrand = brand === 'Outros' ? otherBrand : brand;
    onSave({ name, brand: finalBrand, invoiceDueDate: Number(invoiceDueDate) });
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

            {/* Conditionally render this input field if brand is 'Outros' */}
            {brand === 'Outros' && (
              <div className={styles.formGroup}>
                <label>Qual bandeira?</label>
                <input 
                  type="text" 
                  value={otherBrand} 
                  onChange={(e) => setOtherBrand(e.target.value)} 
                  placeholder="Digite o nome da bandeira"
                  required
                />
              </div>
            )}

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
