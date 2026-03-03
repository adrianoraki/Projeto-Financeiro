
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { addTransaction, getTransactions } from '../../../lib/transactionsService'; // 1. IMPORTAR O SERVIÇO CORRETO
import TransactionModal from '../../../components/TransactionModal';
import DashboardHeader from '../../../components/DashboardHeader';
import BalanceChart from '../../../components/BalanceChart';
import IncomeExpenseChart from '../../../components/IncomeExpenseChart';
import ExpensesPieChart from '../../../components/ExpensesPieChart';
import GoalCard from '../../../components/GoalCard';
import CdiCard from '../../../components/CdiCard';
import InvestmentCard from '../../../components/InvestmentCard';
import styles from '../../../styles/DashboardPage.module.css';
import { Card, getCards, addCard } from '../../../lib/cardService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (user) {
      getTransactions(user.uid).then(setTransactions).catch(console.error);
      getCards(user.uid).then(setCards).catch(console.error);
    }
  }, [user]);

  // 2. SUBSTITUIR A FUNÇÃO ANTIGA PELA CHAMADA AO SERVIÇO CENTRALIZADO
  const handleSaveTransaction = async (transactionData: any) => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    try {
      const dataWithUid = { ...transactionData, uid: user.uid };
      await addTransaction(dataWithUid);
      // Atualiza a lista de transações após salvar
      const updatedTransactions = await getTransactions(user.uid);
      setTransactions(updatedTransactions);
      setShowForm(false);
      setModalOpen(false);
    } catch (err) {
      console.error("Error adding transaction from dashboard: ", err);
      setError("Não foi possível salvar a transação. Verifique os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = async (newCard: Omit<Card, 'id' | 'uid'>) => {
    if (!user) return;
    try {
        await addCard({ ...newCard, uid: user.uid });
        const updatedCards = await getCards(user.uid);
        setCards(updatedCards);
    } catch (error) {
        console.error("Error adding card: ", error);
        // Handle error appropriately
    }
  };

  const openModalWithForm = (type: 'income' | 'expense') => {
    setFormType(type);
    setShowForm(true);
    setModalOpen(true);
    setError(null);
  };

  // DUMMY DATA - Replace with real data
  const goals = [{ id: '1', title: 'Viagem para a Praia', current: 750, goal: 1000 }];
  const cdiRate = 11.65; // Example CDI rate
  const investments = { total: 12500, performance: 5.8 };

  return (
    <div className={styles.container}>
      <DashboardHeader 
        userName={user?.displayName || 'Usuário'} 
        onAddIncome={() => openModalWithForm('income')}
        onAddExpense={() => openModalWithForm('expense')}
      />
      
      <main className={styles.mainGrid}>
        <section className={styles.chartSection}>
          <BalanceChart transactions={transactions} />
        </section>
        <section className={styles.chartSection}>
          <IncomeExpenseChart transactions={transactions} />
        </section>
        <section className={styles.chartSection}>
          <ExpensesPieChart transactions={transactions} />
        </section>
        <section className={styles.cardSection}>
          <GoalCard goal={goals[0]} />
        </section>
        <section className={styles.cardSection}>
          <CdiCard cdiRate={cdiRate} />
        </section>
        <section className={styles.cardSection}>
          <InvestmentCard investments={investments} />
        </section>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        transactions={[]}
        selectedDate={new Date().toISOString().split('T')[0]}
        showForm={showForm}
        formType={formType}
        onSave={handleSaveTransaction} // 3. GARANTIR QUE O onSave CORRETO ESTÁ SENDO USADO
        isSaving={isSaving}
        error={error}
        setShowForm={setShowForm}
        cards={cards}
        onCardAdd={handleAddCard}
      />
    </div>
  );
};

export default DashboardPage;
