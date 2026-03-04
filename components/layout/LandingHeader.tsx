
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/Header.module.css';

const LandingHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/" passHref>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image src="/favicon_2.png" alt="MoneyForge Logo" width={50} height={50} />
                  <div className={styles.logoTextContainer}>
                      <span className={styles.appName}>MoneyForge</span>
                      <span className={styles.slogan}>Forjando dinheiro, construindo riqueza</span>
                  </div>
              </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
