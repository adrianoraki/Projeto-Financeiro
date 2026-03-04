'use client';

import React from 'react';
import styles from '../../styles/InvestmentCard.module.css';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

// Interface para as props que o componente REALMENTE recebe
interface InvestmentCardProps {
  investments: {
    total: number;
    performance: number;
  } | undefined; // A propriedade pode ser indefinida durante o carregamento
}

// Função para formatar valores como moeda
const formatCurrency = (value: number | undefined | null) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const InvestmentCard = ({ investments }: InvestmentCardProps) => {
  // Verificação de segurança: Se os dados não existirem, exibe um estado de carregamento.
  if (!investments) {
    return <div className={styles.investmentCard}><p>Carregando investimentos...</p></div>;
  }

  const { total, performance } = investments;
  const hasIncreased = performance >= 0;

  return (
    <div className={styles.investmentCard}>
      <div className={styles.cardHeader}>
        <h3>Total Investido</h3>
        <span className={hasIncreased ? styles.positive : styles.negative}>
          {hasIncreased ? <FiTrendingUp /> : <FiTrendingDown />}
          {performance.toFixed(2)}%
        </span>
      </div>
      <div className={styles.totalAmount}>
        {formatCurrency(total)}
      </div>
      <p className={styles.footerText}>Performance nos últimos 30 dias</p>
    </div>
  );
};

export default InvestmentCard;
