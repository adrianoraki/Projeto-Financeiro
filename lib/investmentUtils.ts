
export const investmentCategories = {
  'Renda Fixa': ['CDB', 'CDI', 'Tesouro Selic', 'Tesouro IPCA+', 'Tesouro Prefixado', 'LCI', 'LCA', 'LC', 'Debêntures', 'CRI', 'CRA', 'LF'],
  'Renda Variável': ['Ações', 'BDRs', 'Fundos Imobiliários', 'ETFs', 'Fundos de Ações'],
  'Fundos de Investimento': ['Fundos Multimercado', 'Fundos de Renda Fixa', 'Fundos Cambiais', 'Fundos de Crédito Privado', 'Fundos Quantitativos'],
  'Investimentos Internacionais': ['ETFs internacionais', 'Ações no exterior', 'REITs', 'Bonds'],
};

export type InvestmentCategory = keyof typeof investmentCategories;

export function getCategoryForType(type: string): InvestmentCategory | 'Outros' {
  for (const category in investmentCategories) {
    if (investmentCategories[category as InvestmentCategory].includes(type)) {
      return category as InvestmentCategory;
    }
  }
  return 'Outros';
}
