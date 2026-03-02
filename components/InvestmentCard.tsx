
'use client';

import { Line } from 'react-chartjs-2';
import styles from '../styles/InvestmentCard.module.css';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Props {
  platform: {
    name: string;
    type: string;
    profitability: number;
    trend: number[];
  };
}

const InvestmentCard = ({ platform }: Props) => {
  const lastProfitability = platform.trend[platform.trend.length - 2] || 0;
  const currentProfitability = platform.trend[platform.trend.length - 1];
  const hasIncreased = currentProfitability > lastProfitability;

  const data = {
    labels: Array(platform.trend.length).fill(''),
    datasets: [
      {
        data: platform.trend,
        borderColor: hasIncreased ? '#28a745' : '#dc3545',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{platform.name}</h3>
        <span className={styles.type}>{platform.type}</span>
      </div>
      <div className={styles.profitabilitySection}>
        <span className={`${styles.profitability} ${hasIncreased ? styles.increase : styles.decrease}`}>
          {hasIncreased ? <FiArrowUp /> : <FiArrowDown />}
          {platform.profitability.toFixed(2)}%
        </span>
        <div className={styles.chartContainer}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
