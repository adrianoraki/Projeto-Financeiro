
'use client';

import { Line } from 'react-chartjs-2';
import { useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { fromCents } from '../../lib/currencyUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Transaction {
  type: 'income' | 'expense';
  amount: number; // Em centavos
  date: string; // Formato YYYY-MM-DD
}

interface Props {
  transactions: Transaction[];
}

const BalanceChart = ({ transactions }: Props) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let cumulativeBalance = 0;
      const dataPoints = sortedTransactions.map(t => {
        cumulativeBalance += t.type === 'income' ? t.amount : -t.amount;
        return {
          x: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          y: fromCents(cumulativeBalance),
        };
      });

      const labels = dataPoints.map(p => p.x);
      const dataValues = dataPoints.map(p => p.y);

      const gradient = chart.ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(74, 144, 226, 0.4)');
      gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');

      setChartData({
        labels,
        datasets: [
          {
            label: 'Saldo',
            data: dataValues,
            borderColor: '#4A90E2',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4A90E2',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4A90E2',
            pointRadius: 4,
            pointHoverRadius: 8,
          },
        ],
      });
    }

  }, [transactions]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Evolução do Patrimônio',
        color: '#E0E0E0',
        font: {
            size: 16,
            weight: 'bold',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#A0AEC0',
        },
        grid: {
          color: 'rgba(160, 174, 192, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#A0AEC0',
          callback: function(value) {
            return 'R$ ' + (typeof value === 'number' ? value.toLocaleString('pt-BR') : value);
          }
        },
        grid: {
          color: 'rgba(160, 174, 192, 0.1)',
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#252a41', borderRadius: '12px', padding: '1.5rem', height: '350px' }}>
        <Line ref={chartRef} options={options} data={chartData} />
    </div>
  );
};

export default BalanceChart;
