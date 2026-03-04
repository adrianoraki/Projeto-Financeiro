
import React from 'react'; // ADICIONADO PARA CORRIGIR O ERRO DE COMPILAÇÃO
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "../../lib/AuthContext";
import { FaHome, FaPlus, FaCalendarAlt, FaChartPie, FaPiggyBank, FaCreditCard, FaListAlt } from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';
import styles from '../../styles/Sidebar.module.css';

interface SidebarProps {
  onOpenModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenModal }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { href: '/transactions', icon: <FaListAlt />, label: 'Transações' },
    { href: '/calendar', icon: <FaCalendarAlt />, label: 'Calendário' },
    { href: '/budget', icon: <FaChartPie />, label: 'Orçamento' },
    { href: '/investments', icon: <IoIosRocket />, label: 'Investimentos' },
    { href: '/goals', icon: <FaPiggyBank />, label: 'Metas' },
    { href: '/payment-methods', icon: <FaCreditCard />, label: 'Meus Cartões' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A')}
        </div>
        <p className={styles.email}>{user?.email}</p>
      </div>
      <nav className={styles.nav}>
        {/* O botão 'Nova Transação' mantém o onClick para abrir o modal */}
        <a href="#" className={styles.navItem} onClick={onOpenModal}>
          <FaPlus /> Nova Transação
        </a>

        {/* Os itens de navegação agora usam <Link> */}
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}>
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
