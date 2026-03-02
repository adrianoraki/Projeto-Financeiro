
'use client';

import styles from '../../../styles/InvestmentsPage.module.css';
import InvestmentCard from '../../../components/InvestmentCard';

// Mock data simulating real-time updates
const investmentPlatforms = [
  {
    id: '1',
    name: 'XP Investimentos',
    type: 'Corretora',
    profitability: 12.5,
    trend: [5, 6, 8, 7, 9, 11, 12.5],
  },
  {
    id: '2',
    name: 'Nu Invest',
    type: 'Banco Digital',
    profitability: 11.8,
    trend: [10, 9, 9.5, 10.5, 11, 11.5, 11.8],
  },
  {
    id: '3',
    name: 'BTG Pactual',
    type: 'Banco de Investimento',
    profitability: 13.2,
    trend: [11, 11.5, 12, 12.8, 13, 13.5, 13.2],
  },
  {
    id: '4',
    name: 'Tesouro Direto',
    type: 'Governo Federal',
    profitability: 9.8,
    trend: [9, 9.2, 9.1, 9.5, 9.6, 9.7, 9.8],
  },
  {
    id: '5',
    name: 'Bradesco',
    type: 'Banco Tradicional',
    profitability: 10.5,
    trend: [8, 8.5, 9, 9.5, 10, 10.2, 10.5],
  },
  {
    id: '6',
    name: 'Caixa',
    type: 'Banco Tradicional',
    profitability: 9.5,
    trend: [7, 7.5, 8, 8.5, 9, 9.2, 9.5],
  },
  {
    id: '7',
    name: 'Banco do Brasil',
    type: 'Banco Tradicional',
    profitability: 10.2,
    trend: [8, 8.2, 8.5, 9, 9.5, 9.8, 10.2],
  },
];

const InvestmentsPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Plataformas de Investimento</h1>
        <p>Acompanhe a rentabilidade das melhores plataformas em tempo real.</p>
      </header>
      <div className={styles.investmentsGrid}>
        {investmentPlatforms.map(platform => (
          <InvestmentCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  );
};

export default InvestmentsPage;
