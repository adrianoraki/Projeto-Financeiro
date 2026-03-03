
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  PaymentMethodRecord,
  PaymentMethodDetails,
  PaymentMethod
} from '../../../lib/paymentMethodService';
import PaymentMethodForm from '../../../components/PaymentMethodForm';
import styles from '../../../styles/CardsPage.module.css';
import { FaTrash, FaCreditCard, FaMoneyBillWave, FaBarcode, FaUniversity } from 'react-icons/fa';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.tooltipIcon}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c0-.662.538-1.2 1.2-1.2s1.2.538 1.2 1.2v5.25c0 .662-.538 1.2-1.2 1.2s-1.2-.538-1.2-1.2V10.558zM12 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
);

const PaymentMethodsPage = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    if (user) {
      try {
        setPaymentMethods(await getPaymentMethods(user.uid));
      } catch (err) {
        console.error(err);
        setError('Falha ao buscar as formas de pagamento.');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleSavePaymentMethod = async (data: { name: string; type: PaymentMethod['type']; details: PaymentMethodDetails }) => {
    if (!user) return;
    setIsModalOpen(false);
    setError(null);

    const newMethod: Omit<PaymentMethodRecord, 'id' | 'createdAt'> = {
      uid: user.uid,
      name: data.name,
      type: data.type,
      details: data.details
    };

    try {
      const savedMethod = await addPaymentMethod(newMethod);
      setPaymentMethods(prev => [...prev, savedMethod]);
    } catch (err) {
      console.error("Erro ao salvar a forma de pagamento:", err);
      setError('Ocorreu um erro ao salvar a forma de pagamento.');
    }
  };
  
  const handleDeletePaymentMethod = async (id: string) => {
    if (!id) return;
    const originalMethods = [...paymentMethods];
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    try {
      await deletePaymentMethod(id);
    } catch (err) {
      console.error("Erro ao deletar a forma de pagamento:", err);
      setError('Falha ao deletar a forma de pagamento.');
      setPaymentMethods(originalMethods);
    }
  }

  const getIconForType = (type: PaymentMethod['type']) => {
      switch(type) {
          case 'creditCard': return <FaCreditCard />;
          case 'pix': return <FaMoneyBillWave />;
          case 'boleto': return <FaBarcode />;
          case 'debit': return <FaUniversity />;
          default: return <FaWallet />;
      }
  }

  const renderPaymentMethodDetails = (method: PaymentMethodRecord) => {
    switch (method.type) {
        case 'creditCard':
            const details = method.details as any;
            return <><p>Bandeira: {details.brand}</p><p>Vencimento: Dia {details.invoiceDueDate}</p></>;
        case 'pix':
        case 'debit':
            const pixDebitDetails = method.details as any;
            return <><p>Banco: {pixDebitDetails.bank}</p><p>Pagamento: {pixDebitDetails.paymentType === 'avista' ? 'À Vista' : 'Parcelado'}</p></>;
        case 'boleto':
            const boletoDetails = method.details as any;
            return <p>Pagamento: {boletoDetails.paymentType === 'avista' ? 'À Vista' : 'Parcelado'}</p>;
        default:
            return null;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Formas de Pagamento</h1>
        <div className={styles.headerActions}>
          <button onClick={() => { setIsModalOpen(true); setError(null); }} className={styles.addButton}>
            + Adicionar Forma de Pagamento
          </button>
          <div className={styles.tooltipContainer}>
            <InfoIcon />
            <span className={styles.tooltipText}>
              Cadastre seus cartões, contas PIX, boletos e outras formas de pagamento para organizar suas transações.
            </span>
          </div>
        </div>
      </div>
      
      {error && <p className={styles.error}>{error}</p>} 

      <div className={styles.cardsGrid}>
        {paymentMethods.map(method => (
            <div key={method.id} className={`${styles.card} ${styles[method.type]}`}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>{getIconForType(method.type)}</span>
                    <h3>{method.name}</h3>
                </div>
                <div className={styles.cardBody}>
                    {renderPaymentMethodDetails(method)}
                </div>
                <button 
                  onClick={() => handleDeletePaymentMethod(method.id!)} 
                  className={styles.deleteButton}
                >
                  <FaTrash />
                </button>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <PaymentMethodForm 
          onSave={handleSavePaymentMethod}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default PaymentMethodsPage;
