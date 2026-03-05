
'use client';

import React from 'react';
import { useAuth } from '../../../lib/AuthContext';
import styles from '../../../styles/AppHeader.module.css';
import { useRouter } from 'next/navigation';

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerTitle}>
        {/* Pode ser dinâmico no futuro */}
        <h2>Visão Geral</h2>
      </div>
      <div className={styles.userMenu}>
        <span>Olá, {user?.displayName || user?.email}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
