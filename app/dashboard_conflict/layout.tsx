
'use client';

import React from 'react';
import AppHeader from '../../components/layout/AppHeader';
import Sidebar from '../../components/layout/Sidebar';
import styles from '../../styles/Dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleOpenModal = () => {
    // Função vazia para satisfazer a prop, já que este layout é um conflito
  };

  return (
    <div className={styles.dashboardContainer}>
        <Sidebar onOpenModal={handleOpenModal} />
        <main className={styles.mainContent}>
            <AppHeader />
            <div className={styles.pageContent}>
                {children}
            </div>
        </main>
    </div>
  );
}
