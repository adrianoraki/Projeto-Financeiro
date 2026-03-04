
'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import styles from '../../styles/InvestmentForm.module.css';

const investmentOptions = {
  'Renda Fixa': [
    'CDB', 'Tesouro Selic', 'Tesouro IPCA+', 'Tesouro Prefixado', 'LCI', 'LCA', 'LC', 'Debêntures', 'CRI', 'CRA', 'LF'
  ],
  'Renda Variável': [
    'Ações', 'BDRs', 'FIIs', 'ETFs', 'Fundos de Ações'
  ],
  'Fundos de Investimento': [
    'Fundos Multimercado', 'Fundos de Renda Fixa', 'Fundos Cambiais', 'Fundos de Crédito Privado', 'Fundos Quantitativos'
  ],
  'Investimentos Internacionais': [
    'ETFs internacionais', 'Ações no exterior', 'REITs', 'Bonds'
  ]
};

interface InvestmentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void; // Radix Select's onValueChange returns a string
  quotes: { [key: string]: { changePercent: number } };
}

const InvestmentTypeSelector: React.FC<InvestmentTypeSelectorProps> = ({ value, onChange, quotes }) => {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className={styles.selectTrigger}>
        <Select.Value placeholder="Selecione um tipo de investimento" />
        <Select.Icon className={styles.selectIcon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={styles.selectContent}>
          <Select.ScrollUpButton className={styles.selectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className={styles.selectViewport}>
            {Object.entries(investmentOptions).map(([category, types]) => (
              <Select.Group key={category}>
                <Select.Label className={styles.selectLabel}>{category}</Select.Label>
                {types.map(type => {
                  const quote = quotes[type];
                  const performance = quote ? quote.changePercent : null;
                  const isPositive = performance !== null && performance >= 0;

                  return (
                    <Select.Item key={type} value={type} className={styles.selectItem}>
                      <Select.ItemText>
                        {type}
                        {performance !== null && (
                          <span className={isPositive ? styles.positive : styles.negative}>
                            {isPositive ? ' ▲' : ' ▼'} {performance.toFixed(2)}%
                          </span>
                        )}
                      </Select.ItemText>
                      <Select.ItemIndicator className={styles.selectItemIndicator}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
              </Select.Group>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className={styles.selectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default InvestmentTypeSelector;
