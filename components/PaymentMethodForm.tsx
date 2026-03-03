
'use client';

import { useState } from 'react';
import styles from '../../styles/PaymentMethodForm.module.css';
import { PaymentMethod, PaymentMethodDetails } from '../../lib/paymentMethodService';

// --- Component Props ---
interface PaymentMethodFormProps {
  onSave: (data: { 
    name: string; 
    type: PaymentMethod['type']; 
    details: PaymentMethodDetails 
  }) => Promise<void>;
  onClose: () => void;
}

// --- Constants ---
const cardBrands = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard", "Outra"];
const paymentTypes = [ { value: 'avista', label: 'À Vista' }, { value: 'parcelado', label: 'Parcelado' } ];

const PaymentMethodForm = ({ onSave, onClose }: PaymentMethodFormProps) => {
  
  // --- State Management ---
  const [type, setType] = useState<PaymentMethod['type']>('creditCard');
  const [name, setName] = useState('');
  
  // Card state
  const [brand, setBrand] = useState(cardBrands[0]);
  const [invoiceDueDate, setInvoiceDueDate] = useState(1);

  // PIX state
  const [bank, setBank] = useState('');
  const [pixPaymentType, setPixPaymentType] = useState(paymentTypes[0].value);

  // Boleto state
  const [boletoPaymentType, setBoletoPaymentType] = useState(paymentTypes[0].value);
  
  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let details: PaymentMethodDetails;

    switch (type) {
      case 'creditCard':
        details = { brand, invoiceDueDate };
        break;
      case 'pix':
        if (!bank.trim()) { alert("Por favor, insira o nome do banco."); return; }
        details = { bank, paymentType: pixPaymentType as 'avista' | 'parcelado' };
        break;
      case 'boleto':
        details = { paymentType: boletoPaymentType as 'avista' | 'parcelado' };
        break;
      case 'debit':
          if (!bank.trim()) { alert("Por favor, insira o nome do banco."); return; }
          details = { bank, paymentType: 'avista' };
          break;
    }

    await onSave({ name, type, details });
  };

  // --- JSX Rendering for Dynamic Fields ---
  const renderDynamicFields = () => {
    switch (type) {
      case 'creditCard':
        return (
          <>
            <div className={styles.formGroup}><label>Bandeira</label><select value={brand} onChange={e => setBrand(e.target.value)}>{cardBrands.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
            <div className={styles.formGroup}><label>Dia do Vencimento da Fatura</label><input type="number" min="1" max="31" value={invoiceDueDate} onChange={e => setInvoiceDueDate(parseInt(e.target.value))} /></div>
          </>
        );
      case 'pix':
        return (
          <>
            <div className={styles.formGroup}><label>Nome do Banco</label><input type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="Ex: Itaú, Nubank" /></div>
            <div className={styles.formGroup}><label>Tipo de Pagamento</label><select value={pixPaymentType} onChange={e => setPixPaymentType(e.target.value)}>{paymentTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
          </>
        );
      case 'boleto':
        return (
            <div className={styles.formGroup}><label>Tipo de Pagamento</label><select value={boletoPaymentType} onChange={e => setBoletoPaymentType(e.target.value)}>{paymentTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
        );
      case 'debit':
          return <div className={styles.formGroup}><label>Nome do Banco</label><input type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="Ex: Itaú, Nubank" /></div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit}>
            <div className={styles.modalHeader}>
                <h2>Adicionar Forma de Pagamento</h2>
                <button type="button" className={styles.closeButton} onClick={onClose}>&times;</button>
            </div>

            <div className={styles.formGroup}><label>Tipo</label><select value={type} onChange={e => setType(e.target.value as PaymentMethod['type'])}><option value="creditCard">Cartão de Crédito</option><option value="pix">PIX</option><option value="boleto">Boleto</option><option value="debit">Débito</option></select></div>
            <div className={styles.formGroup}><label>Nome/Apelido</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Cartão Principal, Conta Salário" required /></div>
            
            {renderDynamicFields()}
            
            <div className={styles.buttonGroup}><button type="submit" className={styles.submitButton}>Salvar</e <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button></div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
