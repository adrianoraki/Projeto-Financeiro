
'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import styles from '../../../styles/Recurring.module.css';

interface RecurringItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  dayOfMonth: number;
}

export default function RecurringPage() {
  const { user } = useAuth();
  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemType, setNewItemType] = useState<'income' | 'expense'>('expense');
  const [newItemDay, setNewItemDay] = useState('');

  const fetchRecurringItems = async () => {
    if (user) {
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/recurring`));
        const items: RecurringItem[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecurringItem));
        setRecurringItems(items);
      } catch (error) {
        console.error("Error fetching recurring items: ", error);
      }
    }
  };

  useEffect(() => {
    fetchRecurringItems();
  }, [user]);

  const addRecurringItem = async () => {
    if (user && newItemName && newItemAmount && newItemDay) {
      try {
        await addDoc(collection(db, `users/${user.uid}/recurring`), {
          name: newItemName,
          amount: parseFloat(newItemAmount),
          type: newItemType,
          dayOfMonth: parseInt(newItemDay)
        });
        setNewItemName('');
        setNewItemAmount('');
        setNewItemType('expense');
        setNewItemDay('');
        fetchRecurringItems();
      } catch (error) {
        console.error("Error adding recurring item: ", error);
      }
    }
  };

  const deleteRecurringItem = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/recurring`, id));
        fetchRecurringItems();
      } catch (error) {
        console.error("Error deleting recurring item: ", error);
      }
    }
  };

  return (
    <div className={styles.recurringContainer}>
      <h1 className={styles.title}>Transações Recorrentes</h1>
      
      <div className={styles.inputForm}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nome da Transação"
        />
        <input
          type="number"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
          placeholder="Valor"
        />
        <select value={newItemType} onChange={(e) => setNewItemType(e.target.value as 'income' | 'expense')}>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
        <input
          type="number"
          value={newItemDay}
          onChange={(e) => setNewItemDay(e.target.value)}
          placeholder="Dia do Mês"
          min="1" 
          max="31"
        />
        <button onClick={addRecurringItem}>Adicionar</button>
      </div>

      <ul className={styles.recurringList}>
        {recurringItems.map(item => (
          <li key={item.id} className={`${styles.recurringItem} ${styles[item.type]}`}>
            <span>{item.name} (Dia {item.dayOfMonth})</span>
            <span>R$ {item.amount.toFixed(2)}</span>
            <button onClick={() => deleteRecurringItem(item.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
