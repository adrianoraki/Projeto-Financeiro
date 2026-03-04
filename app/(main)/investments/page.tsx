
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { getInvestmentsByOwner, Investment } from '../../../lib/investmentService';
import InvestmentCard from '../../../components/investments/InvestmentCard';
import InvestmentForm from '../../../components/investments/InvestmentForm';
import styles from '../../../styles/InvestmentPage.module.css';

// Mapeamento de tipo de investimento para categoria
const investmentCategoryMapping: { [key: string]: string } = {
  'CDB': 'Renda Fixa', 'Tesouro Selic': 'Renda Fixa', 'Tesouro IPCA+': 'Renda Fixa', 'Tesouro Prefixado': 'Renda Fixa', 'LCI': 'Renda Fixa', 'LCA': 'Renda Fixa', 'LC': 'Renda Fixa', 'Debêntures': 'Renda Fixa', 'CRI': 'Renda Fixa', 'CRA': 'Renda Fixa', 'LF': 'Renda Fixa',
  'Ações': 'Renda Variável', 'BDRs': 'Renda Variável', 'FIIs': 'Renda Variável', 'ETFs': 'Renda Variável', 'Fundos de Ações': 'Renda Variável',
  'Fundos Multimercado': 'Fundos de Investimento', 'Fundos de Renda Fixa': 'Fundos de Investimento', 'Fundos Cambiais': 'Fundos de Investimento', 'Fundos de Crédito Privado': 'Fundos de Investimento', 'Fundos Quantitativos': 'Fundos de Investimento',
  'ETFs internacionais': 'Investimentos Internacionais', 'Ações no exterior': 'Investimentos Internacionais', 'REITs': 'Investimentos Internacionais', 'Bonds': 'Investimentos Internacionais'
};

// Interfaces para garantir a tipagem
interface InvestmentWithQuote extends Investment {
  currentValue: number;
  changePercent: number;
}

interface Quote {
  changePercent: number;
}

interface Quotes {
  [key: string]: Quote;
}

interface CategoryData {
  [category: string]: InvestmentWithQuote[];
}

interface BankData {
  total: number;
  categories: CategoryData;
}

interface InvestmentsByBank {
  [bank: string]: BankData;
}


const InvestmentPage = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [quotes, setQuotes] = useState<Quotes>({});
  const [isFormOpen, setFormOpen] = useState(false);

  const fetchInvestmentsAndQuotes = async () => {
    if (user) {
      try {
        const [userInvestments, quotesData] = await Promise.all([
          getInvestmentsByOwner(user.uid),
          fetch('/api/investments/quotes').then(res => res.json())
        ]);
        setInvestments(userInvestments);
        setQuotes(quotesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
        fetchInvestmentsAndQuotes();
        const interval = setInterval(fetchInvestmentsAndQuotes, 30000); // Atualiza a cada 30 segundos
        return () => clearInterval(interval);
    }
  }, [user]);

  const totalInitialInvestment = investments.reduce((acc, inv) => acc + inv.initialValue, 0);

  const investmentsByBank = investments.reduce((acc, inv) => {
    const bank = inv.institution || 'Outros';
    const category = investmentCategoryMapping[inv.type] || 'Outras Categorias';

    if (!acc[bank]) {
      acc[bank] = { total: 0, categories: {} };
    }

    if (!acc[bank].categories[category]) {
      acc[bank].categories[category] = [];
    }

    const quote = quotes[inv.type] || { changePercent: 0 };
    const currentValue = inv.initialValue * (1 + (quote.changePercent / 100));

    acc[bank].categories[category].push({ ...inv, currentValue, changePercent: quote.changePercent });
    acc[bank].total += currentValue;

    return acc;
  }, {} as InvestmentsByBank);

  const totalCurrentValue = Object.values(investmentsByBank).reduce((sum, bank) => sum + bank.total, 0);

  const investmentSummary = {
    total: totalCurrentValue,
    performance: totalInitialInvestment > 0 ? ((totalCurrentValue - totalInitialInvestment) / totalInitialInvestment) * 100 : 0,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meus Investimentos</h1>
        <button onClick={() => setFormOpen(true)} className={styles.addButton}>Adicionar Investimento</button>
      </header>

      {isFormOpen && (
        <InvestmentForm 
          onSave={() => { setFormOpen(false); fetchInvestmentsAndQuotes(); }}
          onClose={() => setFormOpen(false)}
        />
      )}

      <div className={styles.cardContainer}>
        <InvestmentCard investments={investmentSummary} />
      </div>

      <div className={styles.listContainer}>
        <h2>Bancos</h2>
        {Object.keys(investmentsByBank).length === 0 ? (
          <p className={styles.emptyStateMessage}>
            Você ainda não adicionou nenhum investimento. Clique em Adicionar Investimento para começar.
          </p>
        ) : (
          Object.entries(investmentsByBank).map(([bank, data]) => {
            const percentage = totalCurrentValue > 0 ? (data.total / totalCurrentValue) * 100 : 0;
            return (
              <div key={bank} className={styles.bankSection}>
                <div className={styles.bankHeader}>
                  <h3 className={styles.bankName}>{bank}</h3>
                  <span className={styles.bankPercentage}>{percentage.toFixed(2)}%</span>
                </div>
                {Object.entries(data.categories).map(([category, invs]) => (
                  <div key={category} className={styles.categorySection}>
                    <h4>{category}</h4>
                    <table className={styles.investmentTable}>
                      <thead>
                        <tr>
                          <th>Ativo</th>
                          <th>Valor Aplicado</th>
                          <th>Valor Atual</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invs.map((inv) => (
                          <tr key={inv.id}>
                            <td>{inv.type}</td>
                            <td>R$ {inv.initialValue.toFixed(2)}</td>
                            <td>R$ {inv.currentValue.toFixed(2)}</td>
                            <td className={inv.changePercent >= 0 ? styles.positive : styles.negative}>
                              {inv.changePercent.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default InvestmentPage;
