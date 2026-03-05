
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/Sidebar.module.css';
import Image from 'next/image';
import {
  FaTachometerAlt,
  FaHistory,
  FaPiggyBank,
  FaChartLine,
  FaCog,
  FaPlusCircle, // Ícone para Nova Transação
} from 'react-icons/fa';

// Interface para as props do Sidebar
interface SidebarProps {
  onOpenModal: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/history', label: 'Histórico', icon: FaHistory },
  { href: '/budget', label: 'Orçamentos', icon: FaPiggyBank },
  { href: '/investments', label: 'Investimentos', icon: FaChartLine },
  { href: '/settings', label: 'Configurações', icon: FaCog },
];

const Sidebar: React.FC<SidebarProps> = ({ onOpenModal }) => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Image src="/imagem_4.png" alt="MoneyForge Logo" width={60} height={60} />
        <span className={styles.logoText}>MoneyForge</span>
      </div>
      
      {/* Botão de Nova Transação */}
      <div className={styles.newTransactionContainer}>
        <button onClick={onOpenModal} className={styles.newTransactionButton}>
          <FaPlusCircle className={styles.newTransactionIcon} />
          <span>Nova Transação</span>
        </button>
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
