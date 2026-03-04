
'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TransactionModal from '../transaction/TransactionModal'; // Importa o modal
import styles from '../../styles/Layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Estado para controlar a visibilidade do modal
  const [isModalOpen, setModalOpen] = useState(false);

  // Funções para abrir e fechar o modal
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className={styles.layout}>
      {/* Passa a função para abrir o modal para o Sidebar */}
      <Sidebar onOpenModal={handleOpenModal} />
      
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Renderiza o modal, passando o estado de visibilidade */}
      {isModalOpen && (
        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Layout;
