
'use client';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { fromCents } from '../../lib/currencyUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
    type: 'income' | 'expense';
    amount: number;
    category?: string;
}

interface ExpensesPieChartProps {
  transactions: Transaction[];
}

// Paleta de cores moderna e vibrante para o tema escuro
const VIBRANT_COLORS = [
    '#4A90E2', // Azul
    '#34D399', // Verde
    '#F5A623', // Laranja
    '#BD10E0', // Roxo
    '#7ED321', // Verde Limão
    '#F87171', // Vermelho Claro
    '#9013FE', // Roxo Escuro
    '#50E3C2', // Turquesa
];

const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter((t) => t.type === 'expense' && t.category)
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Outros'; // Agrupa transações sem categoria
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as { [key: string]: number });

  const data: ChartData<'pie'> = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        data: Object.values(expenseData).map(amount => fromCents(amount)),
        backgroundColor: VIBRANT_COLORS,
        borderColor: '#252a41', // Cor de fundo do container para criar separação
        borderWidth: 2, // Borda entre as fatias
        hoverOffset: 10, // Efeito de destaque ao passar o mouse
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Despesas por Categoria',
            color: '#E0E0E0',
            font: {
                size: 16,
                weight: 'bold',
            }
        },
        legend: {
            position: 'bottom' as const,
            labels: {
                color: '#A0AEC0',
                padding: 15,
            },
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
                label: function(context: TooltipItem<'pie'>) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    const value = context.parsed;
                    if (value !== null) {
                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                    }
                    return label;
                }
            }
        }
    }
  };

  return (
    <div style={{ backgroundColor: '#252a41', borderRadius: '12px', padding: '1.5rem', height: '350px' }}>
        <Pie data={data} options={options} />
    </div>
  );
};

export default ExpensesPieChart;
