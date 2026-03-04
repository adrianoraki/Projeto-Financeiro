
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../lib/AuthContext';
import styles from '../../styles/Header.module.css';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className={styles.header}>
        <div className={styles.logoContainer}>
            <Image src="/favicon_2.png" alt="MoneyForge Logo" width={50} height={50} />
            <div className={styles.logoTextContainer}>
                <span className={styles.appName}>MoneyForge</span>
                <span className={styles.slogan}>Forjando dinheiro, construindo riqueza</span>
            </div>
        </div>
        <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/investments" className={styles.navLink}>Investimentos</Link>
            <Link href="/budget" className={styles.navLink}>Orçamentos</Link>
            {user && (
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Sair
                </button>
            )}
        </nav>
    </header>
  );
};

export default Header;
