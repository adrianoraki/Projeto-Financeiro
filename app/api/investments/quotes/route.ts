
import { NextResponse } from 'next/server';

// Lista de tipos de investimento que queremos simular
const investmentTypes = [
  'CDB', 'Tesouro Selic', 'Tesouro IPCA+', 'Tesouro Prefixado', 'LCI', 'LCA', 'LC', 'Debêntures', 'CRI', 'CRA', 'LF',
  'Ações', 'BDRs', 'FIIs', 'ETFs', 'Fundos de Ações',
  'Fundos Multimercado', 'Fundos de Renda Fixa', 'Fundos Cambiais', 'Fundos de Crédito Privado', 'Fundos Quantitativos',
  'ETFs internacionais', 'Ações no exterior', 'REITs', 'Bonds'
];

/**
 * Simula dados de cotação em tempo real para uma lista de tipos de investimento.
 */
export async function GET() {
  try {
    const quotes = investmentTypes.reduce((acc, type) => {
      // Simula uma variação percentual diária entre -5% e +5%
      const dailyChange = (Math.random() * 10 - 5);
      // Simula um valor atual baseado em um valor base (ex: 100) mais a variação
      const currentValue = 100 + (100 * (dailyChange / 100));

      acc[type] = {
        currentValue: parseFloat(currentValue.toFixed(2)),
        changePercent: parseFloat(dailyChange.toFixed(2)),
      };

      return acc;
    }, {} as { [key: string]: { currentValue: number; changePercent: number } });

    return NextResponse.json(quotes);

  } catch (error) {
    console.error("Error generating simulated quotes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
