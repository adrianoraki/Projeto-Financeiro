
import Sidebar from './Sidebar';
import styles from '../styles/Layout.module.css';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;
