
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaExchangeAlt, FaCalendarAlt, FaChartPie, FaPiggyBank, FaWallet, FaSignOutAlt, FaCreditCard, FaCamera } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';
import { useAuth } from '../lib/AuthContext';
import { useRef } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout, updateUserProfileImage } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => pathname === path;

  const getAvatarUrl = () => {
    if (user?.photoURL) {
      return user.photoURL;
    }
    if (user?.email) {
      const nameForAvatar = user.email.split('@')[0].replace('.', '+');
      return `https://ui-avatars.com/api/?name=${nameForAvatar}&background=042f2f&color=fff&size=60`;
    }
    return 'https://via.placeholder.com/60';
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      await updateUserProfileImage(file);
    }
  };

  return (
    <aside className={styles.sidebar}>
        <div className={styles.profile}>
            {user && (
                <div className={styles.avatarContainer} onClick={handleAvatarClick}>
                    <img src={getAvatarUrl()} alt="User Avatar" className={styles.avatar} />
                    <div className={styles.avatarOverlay}><FaCamera /></div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            )}
            <span className={styles.email}>{user?.email}</span>
        </div>
      <nav className={styles.nav}>
        <ul>
          <li className={isActive('/') ? styles.active : ''}>
            <Link href="/"><FaHome /> <span>Dashboard</span></Link>
          </li>
          {/* ... outros itens de menu ... */}
          <li className={isActive('/transactions') ? styles.active : ''}>
            <Link href="/transactions"><FaExchangeAlt /> <span>Transações</span></Link>
          </li>
          <li className={isActive('/calendar') ? styles.active : ''}>
            <Link href="/calendar"><FaCalendarAlt /> <span>Calendário</span></Link>
          </li>
          <li className={isActive('/budget') ? styles.active : ''}>
            <Link href="/budget"><FaChartPie /> <span>Orçamento</span></Link>
          </li>
          <li className={isActive('/investments') ? styles.active : ''}>
            <Link href="/investments"><FaWallet /> <span>Investimentos</span></Link>
          </li>
          <li className={isActive('/goals') ? styles.active : ''}>
            <Link href="/goals"><FaPiggyBank /> <span>Metas</span></Link>
          </li>
          <li className={isActive('/cards') ? styles.active : ''}>
            <Link href="/cards"><FaCreditCard /> <span>Meus Cartões</span></Link>
          </li>
        </ul>
      </nav>
      <div className={styles.logoutWrapper}>
        <button onClick={logout} className={styles.logout}>
            <FaSignOutAlt /> <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
