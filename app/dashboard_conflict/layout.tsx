
import React from 'react';
import AppHeader from '../../components/layout/AppHeader';
import Sidebar from '../../components/layout/Sidebar';
import styles from '../../styles/Dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
            <AppHeader />
            <div className={styles.pageContent}>
                {children}
            </div>
        </main>
    </div>
  );
}
