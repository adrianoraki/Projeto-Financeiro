
import React from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Comentado pois não está em uso
import styles from '../../styles/LandingHeader.module.css';

const LandingHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logoContainer}>
          {/* A imagem do logo foi comentada conforme solicitado */}
          {/* <Image src="/imagem_4.png" alt="MoneyForge Logo" width={60} height={60} className={styles.logo} /> */}
          <div className={styles.logoTextContainer}>
            <h1 className={styles.appName}>MoneyForge</h1>
            <p className={styles.slogan}>Forjando dinheiro, construindo riqueza</p>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default LandingHeader;
