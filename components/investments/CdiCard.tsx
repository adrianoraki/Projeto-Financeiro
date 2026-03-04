'use client';

import React from 'react';
import styles from '../../styles/CdiCard.module.css';

interface CdiCardProps {
  cdiRate: number;
}

const CdiCard = ({ cdiRate }: CdiCardProps) => {
  const formattedRate = cdiRate ? cdiRate.toFixed(2) : '--';

  return (
    <div className={styles.card}>
      <h4>CDI Hoje</h4>
      <p className={styles.rate}>{formattedRate}%</p>
      <span className={styles.source}>Fonte: BrasilAPI</span>
    </div>
  );
};

export default CdiCard;
