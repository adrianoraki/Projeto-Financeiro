'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { getCards, addCard, deleteCard, CreditCard } from '../../../lib/cardsService';
import CardForm from '../../../components/CardForm';
import styles from '../../../styles/CardsPage.module.css';
import { FaTrash } from 'react-icons/fa';

// SVG Icon for the tooltip
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.tooltipIcon}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c0-.662.538-1.2 1.2-1.2s1.2.538 1.2 1.2v5.25c0 .662-.538 1.2-1.2 1.2s-1.2-.538-1.2-1.2V10.558zM12 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
);

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

      setCards(prevCards => 
        prevCards.map(card => 
          card.id === tempId ? savedCard : card
        )
      );

    } catch (err) {
      console.error("Erro ao salvar o cartão:", err);
      setError('Ocorreu um erro ao salvar o cartão. A alteração foi desfeita.');
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
        <div className={styles.headerActions}>
          <button onClick={() => { setIsModalOpen(true); setError(null); }} className={styles.addButton}>
            {cards.length === 0 ? '+ Adicionar primeiro cartão (Opcional)' : '+ Adicionar Cartão'}
          </button>
          <div className={styles.tooltipContainer}>
            <InfoIcon />
            <span className={styles.tooltipText}>
              Fique tranquilo! As informações são apenas para organização. Não pedimos dados sensíveis como número do cartão ou código de segurança.
            </span>
          </div>
        </div>
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
