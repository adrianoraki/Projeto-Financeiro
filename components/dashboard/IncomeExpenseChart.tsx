
'use client';

import { Bar } from 'react-chartjs-2';
import { useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { fromCents } from '../../lib/currencyUtils';

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
  amount: number; // Em centavos
  date: string; // Formato YYYY-MM-DD
}

interface Props {
  transactions: Transaction[];
}

const IncomeExpenseChart = ({ transactions }: Props) => {
    const chartRef = useRef<ChartJS<'bar'>>(null);
    const [chartData, setChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });

    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            const monthlyData = Array(12).fill(0).map(() => ({ income: 0, expense: 0 }));

            transactions.forEach(transaction => {
                const month = new Date(transaction.date).getMonth();
                if (transaction.type === 'income') {
                    monthlyData[month].income += transaction.amount;
                } else {
                    monthlyData[month].expense += transaction.amount;
                }
            });

            const incomeData = monthlyData.map(d => fromCents(d.income));
            const expenseData = monthlyData.map(d => fromCents(d.expense));

            const incomeGradient = chart.ctx.createLinearGradient(0, 0, 0, 400);
            incomeGradient.addColorStop(0, 'rgba(52, 211, 153, 0.8)');
            incomeGradient.addColorStop(1, 'rgba(52, 211, 153, 0.1)');

            const expenseGradient = chart.ctx.createLinearGradient(0, 0, 0, 400);
            expenseGradient.addColorStop(0, 'rgba(248, 113, 113, 0.8)');
            expenseGradient.addColorStop(1, 'rgba(248, 113, 113, 0.1)');

            setChartData({
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [
                    {
                        label: 'Receitas',
                        data: incomeData,
                        backgroundColor: incomeGradient,
                        borderColor: '#34D399',
                        borderWidth: 1,
                        borderRadius: 5,
                    },
                    {
                        label: 'Despesas',
                        data: expenseData,
                        backgroundColor: expenseGradient,
                        borderColor: '#F87171',
                        borderWidth: 1,
                        borderRadius: 5,
                    },
                ],
            });
        }
    }, [transactions]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#A0AEC0',
        },
      },
      title: {
        display: true,
        text: 'Receitas vs. Despesas Mensal',
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
        callbacks: {
            label: function(context: TooltipItem<'bar'>) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                }
                return label;
            }
        }
      }
    },
    scales: {
        x: {
            ticks: { color: '#A0AEC0' },
            grid: { display: false },
        },
        y: {
            ticks: { color: '#A0AEC0' },
            grid: { color: 'rgba(160, 174, 192, 0.1)' },
        },
    },
  };

  return (
    <div style={{ backgroundColor: '#252a41', borderRadius: '12px', padding: '1.5rem', height: '350px' }}>
        <Bar ref={chartRef} options={options} data={chartData} />
    </div>
  );
};

export default IncomeExpenseChart;
