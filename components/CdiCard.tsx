
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/CdiCard.module.css';

const CdiCard = () => {
  const [cdiRate, setCdiRate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCdiRate = async () => {
      try {
        const response = await axios.get('https://brasilapi.com.br/api/taxas/v1/cdi');
        // A API da BrasilAPI retorna os dados mais recentes no final do array
        const latestRate = response.data[response.data.length - 1];
        const formattedRate = (latestRate.valor).toFixed(2);
        setCdiRate(formattedRate);
      } catch (error) {
        console.error('Erro ao buscar a taxa CDI:', error);
        setCdiRate('--'); // Exibe um valor padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchCdiRate();
  }, []);

  return (
    <div className={styles.card}>
      <h4>CDI Hoje</h4>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <p className={styles.rate}>{cdiRate}%</p>
      )}
      <span className={styles.source}>Fonte: BrasilAPI</span>
    </div>
  );
};

export default CdiCard;
