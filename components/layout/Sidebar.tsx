
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/Sidebar.module.css'; // Corrigido o caminho
import Image from 'next/image';
import {
  FaTachometerAlt,
  FaHistory,
  FaPiggyBank,
  FaChartLine,
  FaCog,
} from 'react-icons/fa';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/history', label: 'Histórico', icon: FaHistory },
  { href: '/budget', label: 'Orçamentos', icon: FaPiggyBank },
  { href: '/investments', label: 'Investimentos', icon: FaChartLine },
  { href: '/settings', label: 'Configurações', icon: FaCog },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        {/* Tamanho do logo aumentado para 60x60 */}
        <Image src="/imagem_4.png" alt="MoneyForge Logo" width={60} height={60} />
        <span className={styles.logoText}>MoneyForge</span>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}>
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
