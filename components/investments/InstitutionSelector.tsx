
'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import styles from '../../styles/InvestmentForm.module.css';

const institutionOptions = {
  'Bancos Tradicionais': [
    'Itaú Unibanco',
    'Bradesco',
    'Santander',
    'Banco do Brasil',
    'Caixa Econômica Federal',
  ],
  'Bancos Digitais': [
    'Nubank',
    'Inter',
    'C6 Bank',
    'Neon',
    'Original',
    'Next'
  ],
  'Corretoras de Investimento': [
    'XP Investimentos',
    'Rico',
    'Clear Corretora',
    'BTG Pactual Digital',
    'Genial Investimentos',
    'Toro Investimentos',
    'Ágora Investimentos'
  ],
  'Outros': [
    'Outra Instituição'
  ]
};

interface InstitutionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({ value, onChange }) => {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className={styles.selectTrigger}>
        <Select.Value placeholder="Selecione uma instituição" />
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
            {Object.entries(institutionOptions).map(([category, institutions]) => (
              <Select.Group key={category}>
                <Select.Label className={styles.selectLabel}>{category}</Select.Label>
                {institutions.map(inst => (
                  <Select.Item key={inst} value={inst} className={styles.selectItem}>
                    <Select.ItemText>{inst}</Select.ItemText>
                    <Select.ItemIndicator className={styles.selectItemIndicator}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
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

export default InstitutionSelector;
