
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { addInvestment, InvestmentInput } from '../../lib/investmentService';
import styles from '../../styles/InvestmentForm.module.css';
import InvestmentTypeSelector from './InvestmentTypeSelector';
import InstitutionSelector from './InstitutionSelector';

interface InvestmentFormProps {
  onSave: () => void;
  onClose: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSave, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    initialValue: '',
    goal: '',
    institution: ''
  });
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/investments/quotes');
        const data = await response.json();
        setQuotes(data);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };
    fetchQuotes();
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectorChange = (name: string, value: string) => {
    handleChange(name, value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const investmentData: InvestmentInput = {
        uid: user.uid, // Corrigido de 'owner' para 'uid'
        type: formData.type,
        initialValue: parseFloat(formData.initialValue), // Convertido para número
        startDate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        institution: formData.institution,
      };

      await addInvestment(investmentData);
      onSave();
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Adicionar Investimento</h2>
          
          <div className={styles.inputGroup}>
            <label htmlFor="type">Tipo</label>
            <InvestmentTypeSelector 
              value={formData.type} 
              onChange={(value) => handleSelectorChange('type', value)} 
              quotes={quotes}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="initialValue">Valor Inicial (R$)</label>
            <input type="number" id="initialValue" name="initialValue" value={formData.initialValue} onChange={(e) => handleChange(e.target.name, e.target.value)} required className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="goal">Objetivo (Opcional)</label>
            <input type="text" id="goal" name="goal" value={formData.goal} onChange={(e) => handleChange(e.target.name, e.target.value)} className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="institution">Instituição/Banco</label>
            <InstitutionSelector 
              value={formData.institution}
              onChange={(value) => handleSelectorChange('institution', value)}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.button} ${styles.saveButton}`}>Salvar</button>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.closeButton}`}>Fechar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;
