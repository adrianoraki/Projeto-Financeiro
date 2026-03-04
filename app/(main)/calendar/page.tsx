
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from '../../../styles/CalendarPage.module.css';
import TransactionModal from '../../../components/transaction/TransactionModal';
import { AppTransaction } from '../../../lib/transactionService'; // Usando o tipo correto

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const CalendarPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<AppTransaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // Função para buscar as transações, agora em um useCallback
  const fetchTransactions = useCallback(() => {
    if (user) {
      const q = query(collection(db, 'transactions'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData: AppTransaction[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convertendo Timestamp para string de data
          const date = data.date.toDate().toISOString().split('T')[0];
          transactionsData.push({
            id: doc.id,
            ...data,
            date,
          } as AppTransaction);
        });
        setTransactions(transactionsData);
      }, (error) => {
        console.error("Erro ao buscar transações: ", error);
      });

      return unsubscribe;
    }
  }, [user]);

  // useEffect para configurar a busca de dados
  useEffect(() => {
    const unsubscribe = fetchTransactions();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchTransactions]);

  // Agrupando transações por dia
  const transactionsByDay = useMemo(() => {
    const grouped: { [key: string]: { hasPending: boolean, hasExpense: boolean } } = {};
    transactions.forEach(t => {
      const date = t.date as string;
      if (!grouped[date]) {
        grouped[date] = { hasPending: false, hasExpense: false };
      }
      if (t.type === 'expense') {
        grouped[date].hasExpense = true;
        if (t.status === 'pending') {
          grouped[date].hasPending = true;
        }
      }
    });
    return grouped;
  }, [transactions]);

  // Manipulador para abrir o modal
  const handleDayClick = (dayDate: string) => {
    setSelectedDate(dayDate);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };
  
  const renderMonth = (month: number) => {
    const date = new Date(currentYear, month);
    const monthName = capitalize(date.toLocaleString('pt-BR', { month: 'long' }));
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const firstDay = new Date(currentYear, month, 1).getDay();

    const days = Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`}></div>
    ));

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayData = transactionsByDay[dayDate];
      const isToday = new Date().toISOString().split('T')[0] === dayDate;

      days.push(
        <div 
          key={dayDate}
          className={`${styles.day} ${dayData?.hasExpense ? styles.hasExpense : ''} ${dayData?.hasPending ? styles.hasPending : ''} ${isToday ? styles.today : ''}`}
          onClick={() => handleDayClick(dayDate)}
        >
          {i}
        </div>
      );
    }

    const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((name, i) => (
      <div key={i} className={styles.dayName}>{name}</div>
    ));

    return (
      <div key={month} className={styles.monthContainer}>
        <h2 className={styles.monthHeader}>{monthName}</h2>
        <div className={styles.daysGrid}>
          {dayNames}
          {days}
        </div>
      </div>
    );
  };

  if (!user) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calendário de Gastos</h1>
      <div className={styles.calendarGrid}>
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>

      {/* O TransactionModal agora é autocontido e busca seus próprios dados. */}
      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate || undefined}
          onTransactionAdded={fetchTransactions} // Passando a função para recarregar as transações
        />
      )}
    </div>
  );
};

export default CalendarPage;
