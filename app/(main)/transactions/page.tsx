
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { addTransaction, getTransactions } from '../../../lib/transactionsService'; // Usar o serviço centralizado
import { getPaymentMethods, PaymentMethodRecord } from '../../../lib/paymentMethodService';
import TransactionForm from '../../../components/TransactionForm';
import styles from '../../../styles/TransactionsPage.module.css';
import { collection, db, deleteDoc, doc, onSnapshot, query, updateDoc, where } from '../../../lib/firebase'; // Importar o necessário do firebase

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and sorting state
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // --- Data Fetching ---
  useEffect(() => {
    if (user) {
      const transQuery = query(collection(db, 'transactions'), where('uid', '==', user.uid));
      const unsubscribeTrans = onSnapshot(transQuery, (snapshot) => {
        const transData: any[] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTransactions(transData);
      });

      getPaymentMethods(user.uid)
        .then(setPaymentMethods)
        .catch(err => console.error("Failed to fetch payment methods: ", err));

      return () => unsubscribeTrans();
    }
  }, [user]);

  // --- Filtering and Sorting ---
  useEffect(() => {
    let filtered = [...transactions];
    if (filter !== 'all') filtered = filtered.filter(t => t.type === filter);
    if (filter === 'expense' && statusFilter !== 'all') filtered = filtered.filter(t => t.status === statusFilter);

    // As datas do firestore podem ser timestamps, então precisam ser convertidas
    filtered.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
        const dateB = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime();
        switch (sortBy) {
            case 'date_asc': return dateA - dateB;
            case 'date_desc': return dateB - dateA;
            case 'amount_asc': return a.amount - b.amount;
            case 'amount_desc': return b.amount - a.amount;
            default: return 0;
        }
    });
    setFilteredTransactions(filtered);
  }, [transactions, filter, statusFilter, sortBy]);

  // --- CRUD Handlers (CORRIGIDO) ---
  const handleAddTransaction = async (transactionData: any) => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    try {
        // A lógica de construção do objeto foi movida para o serviço `addTransaction`
        // Apenas garantimos que o UID está presente antes de enviar.
        const dataWithUid = { ...transactionData, uid: user.uid };
        await addTransaction(dataWithUid); // Usar o serviço centralizado e corrigido!
        setModalOpen(false);
    } catch (err) {
        console.error("Error adding transaction: ", err);
        setError("Could not save transaction. Please check permissions and try again.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Tem certeza?")) {
      await deleteDoc(doc(db, 'transactions', id));
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    await updateDoc(doc(db, 'transactions', id), { status: newStatus });
  };

  const handleUpdatePaymentMethod = async (transactionId: string, paymentMethodId: string) => {
    try {
        await updateDoc(doc(db, 'transactions', transactionId), { 
            paymentMethodId: paymentMethodId || null 
        });
    } catch (error) {
        console.error("Erro ao atualizar a forma de pagamento: ", error);
        alert("Ocorreu um erro ao definir a forma de pagamento.");
    }
  };
  
  // --- Rendering ---
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Transações</h1>
        <button onClick={() => { setModalOpen(true); setError(null); }} className={styles.addButton}>Adicionar Transação</button>
      </header>

      <div className={styles.filters}>
        {/* Filter controls... */}
      </div>

      <div className={styles.transactionsList}>
        {filteredTransactions.map(t => {
            const transactionDate = t.date?.toDate ? t.date.toDate() : new Date(t.date + 'T00:00:00');
            return (
                <div key={t.id} className={`${styles.transactionItem} ${styles[t.type]}`}>
                    {t.type === 'expense' && (
                        <div className={styles.statusToggle}>
                            <input type="checkbox" checked={t.status === 'paid'} onChange={() => handleStatusChange(t.id, t.status)} id={`status-${t.id}`} />
                            <label htmlFor={`status-${t.id}`}>{t.status === 'paid' ? 'Pago' : 'Pendente'}</label>
                        </div>
                    )}
                    <div className={styles.transactionDetails}>
                        <span>{t.description}</span>
                        <small>{transactionDate.toLocaleDateString('pt-BR')} - {t.category} / {t.paymentMethod}</small>
                    </div>
                    <div className={styles.transactionPayment}>
                        {t.type === 'expense' ? (
                            <select 
                                value={t.paymentMethodId || ''} 
                                onChange={(e) => handleUpdatePaymentMethod(t.id, e.target.value)}
                                className={styles.paymentSelector}
                            >
                                <option value="">Selecionar Pagamento</option>
                                {paymentMethods.map(pm => (
                                    <option key={pm.id} value={pm.id!}>{pm.name} ({pm.type})</option>
                                ))}
                            </select>
                        ) : (
                            <div /> // Empty div for grid alignment
                        )}
                    </div>
                    <div className={styles.transactionAmount}>
                        <span>{t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <button onClick={() => handleDeleteTransaction(t.id)} className={styles.deleteButton}>&times;</button>
                    </div>
                </div>
            )
        })}
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span onClick={() => { setModalOpen(false); setError(null); }} className={styles.closeButton}>&times;</span>
            {error && <p className={styles.error}>{error}</p>}
            <h2 style={{marginTop: error ? '0.5rem' : '0'}}>Adicionar Nova Transação</h2>
            <TransactionForm
              selectedDate={new Date().toISOString().split('T')[0]}
              onSave={handleAddTransaction}
              onClose={() => { setModalOpen(false); setError(null); }}
              isSaving={isSaving}
              error={null} // Error is now handled above the form
              styles={styles}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
