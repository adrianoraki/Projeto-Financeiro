
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import styles from '../../../styles/TransactionsPage.module.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [installments, setInstallments] = useState(1);

  // Filter and sorting state
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'paid', 'pending'
  const [sortBy, setSortBy] = useState('date_desc');

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

  // Effect to reset status filter when main filter changes from 'expense'
  useEffect(() => {
    if (filter !== 'expense') {
        setStatusFilter('all');
    }
  }, [filter]);

  useEffect(() => {
    let filtered = [...transactions];

    // Filtering by type
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // CORRECTED: Filtering by status, only applies when viewing expenses
    if (filter === 'expense' && statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      const amountA = a.amount;
      const amountB = b.amount;

      switch (sortBy) {
        case 'date_asc':
          return dateA - dateB;
        case 'date_desc':
          return dateB - dateA;
        case 'amount_asc':
          return amountA - amountB;
        case 'amount_desc':
          return amountB - amountA;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, filter, statusFilter, sortBy]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Você precisa estar logado para adicionar uma transação.");
        return;
    }

    try {
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            alert("Por favor, insira um valor válido.");
            return;
        }

        const transactionDate = new Date(date);
        const newTransaction: any = {
            uid: user.uid,
            description,
            amount: amountNumber,
            date,
            type,
            category,
            paymentMethod,
            createdAt: serverTimestamp(),
        };
    
        if (type === 'expense') {
            newTransaction.status = 'pending'; // Default status for expenses
        }

        if (installments > 1 && (paymentMethod === 'Cartão' || paymentMethod === 'Pix')) {
            const installmentAmount = Math.floor((amountNumber / installments) * 100) / 100;
            const promises = [];
            for (let i = 0; i < installments; i++) {
                const installmentDate = new Date(transactionDate);
                installmentDate.setMonth(installmentDate.getMonth() + i);
                
                promises.push(addDoc(collection(db, 'transactions'), {
                ...newTransaction,
                description: `${description} (${i + 1}/${installments})`,
                amount: installmentAmount,
                date: installmentDate.toISOString().split('T')[0],
                }));
            }
            await Promise.all(promises);
        } else {
            await addDoc(collection(db, 'transactions'), newTransaction);
        }
        
        resetForm();
        setModalOpen(false);

    } catch (error) {
        console.error("Erro ao adicionar transação: ", error);
        alert("Ocorreu um erro ao salvar a transação. Verifique os dados e tente novamente.");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (error) {
        console.error("Erro ao deletar transação: ", error);
        alert("Ocorreu um erro ao deletar a transação.");
      }
    }
  }

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
        await updateDoc(doc(db, 'transactions', id), { status: newStatus });
    } catch (error) {
        console.error("Erro ao atualizar status: ", error);
        alert("Ocorreu um erro ao atualizar o status.");
    }
  };


  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setCategory('');
    setPaymentMethod('');
    setInstallments(1);
  }

  const incomeCategories = ['Salário', 'Bonificação', 'Extra', 'Venda de Ativos', 'Comissão', 'Consultoria', 'Aluguéis', 'Rendimentos', 'Metas'];

  const expenseCategories = [
    { 
      group: 'Gastos Essenciais',
      options: ['Moradia', 'Alimentação', 'Saúde', 'Educação', 'Transporte', 'Contas de Consumo']
    },
    {
      group: 'Lazer e Estilo de Vida',
      options: ['Restaurantes', 'Compras', 'Viagens', 'Assinaturas e Serviços', 'Cuidados Pessoais']
    },
    {
      group: 'Investimentos e Metas',
      options: ['Aporte em Corretora', 'Compra de Cripto', 'Cursos e Capacitação', 'Equipamentos']
    },
    {
      group: 'Outras Despesas',
      options: ['Impostos e Taxas', 'Doações', 'Empréstimos', 'Outros']
    }
  ];

  const renderCategoryOptions = () => {
    if (type === 'income') {
      return incomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>);
    } else {
      return expenseCategories.map(categoryGroup => (
        <optgroup key={categoryGroup.group} label={categoryGroup.group}>
          {categoryGroup.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </optgroup>
      ));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Transações</h1>
        <button onClick={() => setModalOpen(true)} className={styles.addButton}>Adicionar Transação</button>
      </div>

      <div className={styles.filters}>
        <div>
          <label>Filtrar por tipo:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
        {filter === 'expense' && (
            <div>
            <label>Filtrar por status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Todos</option>
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
            </select>
            </div>
        )}
        <div>
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Data (Mais Recente)</option>
            <option value="date_asc">Data (Mais Antiga)</option>
            <option value="amount_desc">Valor (Maior para Menor)</option>
            <option value="amount_asc">Valor (Menor para Menor)</option>
          </select>
        </div>
      </div>

      <div className={styles.transactionsList}>
        {filteredTransactions.map(t => (
          <div key={t.id} className={`${styles.transactionItem} ${t.type === 'income' ? styles.income : styles.expense}`}>
            {t.type === 'expense' && (
                <div className={styles.statusToggle}>
                    <input 
                        type="checkbox" 
                        checked={t.status === 'paid'}
                        onChange={() => handleStatusChange(t.id, t.status)}
                        id={`status-${t.id}`}
                    />
                    <label htmlFor={`status-${t.id}`}>{t.status === 'paid' ? 'Pago' : 'Pendente'}</label>
                </div>
            )}
            <div className={styles.transactionDetails}>
              <span>{t.description}</span>
              <small>{new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')} - {t.category}</small>
            </div>
            <div className={styles.transactionAmount}>
              <span>{t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <button onClick={() => handleDeleteTransaction(t.id)} className={styles.deleteButton}>&times;</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span onClick={() => setModalOpen(false)} className={styles.closeButton}>&times;</span>
            <h2>Adicionar Nova Transação</h2>
            <form onSubmit={handleAddTransaction}>
                 <div className={styles.formGroup}>
                <label>Tipo</label>
                <div className={styles.radioGroup}>
                   <button type="button" className={`${styles.typeButton} ${type === 'expense' ? styles.activeExpense : ''}`} onClick={() => setType('expense')}>Despesa</button>
                   <button type="button" className={`${styles.typeButton} ${type === 'income' ? styles.activeIncome : ''}`} onClick={() => setType('income')}>Receita</button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Descrição</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Valor</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Selecione uma categoria</option>
                  {renderCategoryOptions()}
                </select>
              </div>
              <div className={styles.formGroup}>
                  <label>Método de Pagamento</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                      <option value="">Selecione o método</option>
                      <option value="Pix">Pix</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Dinheiro">Dinheiro</option>
                  </select>
              </div>
              {(paymentMethod === 'Cartão' || paymentMethod === 'Pix') && (
                <div className={styles.formGroup}>
                  <label>Número de Parcelas</label>
                  <input type="number" value={installments} onChange={(e) => setInstallments(parseInt(e.target.value, 10))} min="1" />
                </div>
              )}

              <button type="submit" className={styles.submitButton}>Adicionar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
