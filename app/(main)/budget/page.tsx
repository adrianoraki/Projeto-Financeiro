
'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import styles from '../../../styles/Budget.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  createdAt: Timestamp;
}

export default function BudgetPage() {
  const { user } = useAuth();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const fetchBudgetItems = async () => {
    if (user) {
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/budget`));
        const items: BudgetItem[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BudgetItem));
        setBudgetItems(items);
      } catch (error) {
        console.error("Error fetching budget items: ", error);
      }
    }
  };

  useEffect(() => {
    fetchBudgetItems();
  }, [user]);

  const addBudgetItem = async () => {
    if (user && newItemName && newItemAmount) {
      try {
        await addDoc(collection(db, `users/${user.uid}/budget`), {
          name: newItemName,
          amount: parseFloat(newItemAmount),
          category: newItemCategory,
          createdAt: serverTimestamp()
        });
        setNewItemName('');
        setNewItemAmount('');
        setNewItemCategory('');
        fetchBudgetItems();
      } catch (error) {
        console.error("Error adding budget item: ", error);
      }
    }
  };

  const deleteBudgetItem = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/budget`, id));
        fetchBudgetItems();
      } catch (error) {
        console.error("Error deleting budget item: ", error);
      }
    }
  };

  const startEditing = (item: BudgetItem) => {
    setEditingItem(item.id);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
    setEditAmount('');
    setEditCategory('');
  };

  const saveEditing = async (id: string) => {
    if (user) {
      try {
        await updateDoc(doc(db, `users/${user.uid}/budget`, id), {
          name: editName,
          amount: parseFloat(editAmount),
          category: editCategory
        });
        cancelEditing();
        fetchBudgetItems();
      } catch (error) {
        console.error("Error updating budget item: ", error);
      }
    }
  };

  return (
    <div className={styles.budgetContainer}>
      <h1 className={styles.title}>Orçamento Mensal</h1>
      
      <div className={styles.inputForm}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nome do Item"
          className={styles.input}
        />
        <input
          type="number"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
          placeholder="Valor"
          className={styles.input}
        />
        <input
          type="text"
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          placeholder="Categoria"
          className={styles.input}
        />
        <button onClick={addBudgetItem} className={styles.addButton}><FaPlus /> Adicionar</button>
      </div>

      <ul className={styles.budgetList}>
        {budgetItems.map(item => (
          <li key={item.id} className={styles.budgetItem}>
            {editingItem === item.id ? (
              <div className={styles.editForm}>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={styles.input} />
                <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className={styles.input} />
                <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={styles.input} />
                <button onClick={() => saveEditing(item.id)} className={styles.saveButton}><FaSave /></button>
                <button onClick={cancelEditing} className={styles.cancelButton}><FaTimes /></button>
              </div>
            ) : (
              <>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemCategory}>{item.category}</span>
                <span className={styles.itemAmount}>R$ {item.amount.toFixed(2)}</span>
                <div className={styles.itemActions}>
                  <button onClick={() => startEditing(item)} className={styles.editButton}><FaEdit /></button>
                  <button onClick={() => deleteBudgetItem(item.id)} className={styles.deleteButton}><FaTrash /></button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
