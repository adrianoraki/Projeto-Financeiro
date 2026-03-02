
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from '../../../styles/CalendarPage.module.css';
import TransactionModal from '../../../components/TransactionModal';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const CalendarPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'transactions'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData: any[] = [];
        querySnapshot.forEach((doc) => {
          transactionsData.push({ ...doc.data(), id: doc.id });
        });
        setTransactions(transactionsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const transactionsByDay = useMemo(() => {
    const grouped: { [key: string]: { transactions: any[], hasPending: boolean } } = {};
    transactions.forEach(t => {
      const date = t.date;
      if (!grouped[date]) {
        grouped[date] = { transactions: [], hasPending: false };
      }
      grouped[date].transactions.push(t);
      if (t.type === 'expense' && t.status === 'pending') {
        grouped[date].hasPending = true;
      }
    });
    return grouped;
  }, [transactions]);

  const handleDayClick = (dayDate: string) => {
    setSelectedDate(dayDate);
    setModalOpen(true);
  };

  const renderMonth = (month: number) => {
    const date = new Date(currentYear, month);
    const monthName = capitalize(date.toLocaleString('pt-BR', { month: 'long' }));
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const firstDay = new Date(currentYear, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayData = transactionsByDay[dayDate];
      const hasExpense = dayData?.transactions.some(t => t.type === 'expense');
      const hasPending = dayData?.hasPending;
      const isSelected = selectedDate === dayDate;
      const isToday = new Date().toISOString().split('T')[0] === dayDate;

      days.push(
        <div 
          key={dayDate}
          className={`${styles.day} ${hasExpense ? styles.hasExpense : ''} ${hasPending ? styles.hasPending : ''} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
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
      <div className={styles.monthContainer}>
        <h2 className={styles.monthHeader}>{monthName}</h2>
        <div className={styles.daysGrid}>
          {dayNames}
          {days}
        </div>
      </div>
    );
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calendário de Gastos</h1>
      <div className={styles.calendarGrid}>
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>

      {isModalOpen && selectedDate && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          transactions={transactionsByDay[selectedDate]?.transactions || []}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default CalendarPage;
