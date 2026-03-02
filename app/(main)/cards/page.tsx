'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { getCards, addCard, deleteCard, CreditCard } from '../../../lib/cardsService';
import CardForm from '../../../components/CardForm';
import styles from '../../../styles/CardsPage.module.css';
import { FaTrash } from 'react-icons/fa';

const CardsPage = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    if (user) {
      try {
        setCards(await getCards(user.uid));
      } catch (err) {
        console.error(err);
        setError('Falha ao buscar os cartões.');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  const handleSaveCard = async (cardData: { name: string; brand: string; invoiceDueDate: number; }) => {
    if (!user) return;

    setIsModalOpen(false);
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const optimisticCard: CreditCard = {
      id: tempId,
      ...cardData,
      uid: user.uid,
    };

    setCards(prevCards => [...prevCards, optimisticCard]);

    try {
      const savedCard = await addCard({ 
          name: cardData.name, 
          brand: cardData.brand, 
          invoiceDueDate: cardData.invoiceDueDate,
          uid: user.uid 
      });

      // Replace the optimistic card with the real one from the server
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === tempId ? savedCard : card
        )
      );

    } catch (err) {
      console.error("Erro ao salvar o cartão:", err);
      setError('Ocorreu um erro ao salvar o cartão. A alteração foi desfeita.');
      // If the save fails, revert the optimistic update
      setCards(prevCards => prevCards.filter(card => card.id !== tempId));
    }
  };
  
  const handleDeleteCard = async (cardId: string) => {
    if (!cardId || cardId.startsWith('temp-')) return;
    const originalCards = [...cards];
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    try {
      await deleteCard(cardId);
    } catch (err) {
      console.error("Erro ao deletar o cartão:", err);
      setError('Falha ao deletar o cartão. A alteração foi desfeita.');
      setCards(originalCards);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Meus Cartões</h1>
        <button onClick={() => { setIsModalOpen(true); setError(null); }} className={styles.addButton}>+ Adicionar Cartão</button>
      </div>
      
      {error && <p className={styles.error}>{error}</p>} 

      <div className={styles.cardsGrid}>
        {cards.map(card => (
            <div key={card.id} className={`${styles.card} ${card.id?.startsWith('temp-') ? styles.disabled : ''}`}>
                <h3>{card.name}</h3>
                <p>Bandeira: {card.brand}</p>
                <p>Vencimento da Fatura: Dia {card.invoiceDueDate}</p>
                <button 
                  onClick={() => handleDeleteCard(card.id!)} 
                  className={styles.deleteButton}
                  disabled={card.id?.startsWith('temp-')}
                >
                  <FaTrash />
                </button>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <CardForm 
          onSave={handleSaveCard}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default CardsPage;
