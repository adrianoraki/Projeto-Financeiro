
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const IncomeExpenseChart = ({ transactions }: Props) => {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Receitas',
        data: Array(12).fill(0),
        backgroundColor: '#28a745',
      },
      {
        label: 'Despesas',
        data: Array(12).fill(0),
        backgroundColor: '#dc3545',
      },
    ],
  };

  transactions.forEach(transaction => {
    const month = new Date(transaction.createdAt.seconds * 1000).getMonth();
    if (transaction.type === 'income') {
      data.datasets[0].data[month] += transaction.amount;
    } else {
      data.datasets[1].data[month] += transaction.amount;
    }
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Receitas vs. Despesas (Mensal)',
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default IncomeExpenseChart;
