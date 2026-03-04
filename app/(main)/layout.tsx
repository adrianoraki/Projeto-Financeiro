
'use client';

import React, { useState } from 'react';
import { AuthProvider } from '../../lib/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import TransactionModal from '../../components/transaction/TransactionModal'; 
import styles from '../../styles/Layout.module.css';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <AuthProvider>
      <div className={styles.layout}>
        <Header />
        <Sidebar onOpenModal={handleOpenModal} />
        <main className={styles.mainContent}>{children}</main>
        
        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </div>
    </AuthProvider>
  );
}
