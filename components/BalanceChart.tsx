
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  createdAt: { seconds: number };
}

interface Props {
  transactions: Transaction[];
}

const BalanceChart = ({ transactions }: Props) => {
  const sortedTransactions = [...transactions].sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

  let cumulativeBalance = 0;
  const dataPoints = sortedTransactions.map(t => {
    cumulativeBalance += t.type === 'income' ? t.amount : -t.amount;
    return { x: new Date(t.createdAt.seconds * 1000).toLocaleDateString(), y: cumulativeBalance };
  });

  const labels = dataPoints.map(p => p.x);
  const dataValues = dataPoints.map(p => p.y);

  const data = {
    labels,
    datasets: [
      {
        label: 'Evolução do Saldo',
        data: dataValues,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução do Patrimônio',
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default BalanceChart;
