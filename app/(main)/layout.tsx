
'use client';

import React from 'react';
import { AuthProvider } from '../../lib/AuthContext';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Layout.module.css';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </AuthProvider>
  );
}
