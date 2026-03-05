
'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import LandingHeader from '../components/layout/LandingHeader';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <LandingHeader />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Controle suas finanças com <span className={styles.appName}>MoneyForge</span>
          </h1>
          <p className={styles.description}>
            A plataforma completa para organizar suas despesas, planejar orçamentos e alcançar seus objetivos financeiros.
          </p>
          <div className={styles.ctaContainer}>
            <Link href="/login" className={styles.ctaButton}>Comece Agora</Link>
          </div>
        </div>

        <section className={styles.features}>
          <div className={`${styles.featureCard} ${styles.featureCard1}`}>
            <h3>Planejamento de Orçamento</h3>
            <p>Crie orçamentos personalizados e acompanhe seus gastos em tempo real.</p>
          </div>
          <div className={`${styles.featureCard} ${styles.featureCard2}`}>
            <h3>Metas Financeiras</h3>
            <p>Defina e monitore metas de economia para realizar seus sonhos.</p>
          </div>
          <div className={`${styles.featureCard} ${styles.featureCard3}`}>
            <h3>Relatórios Inteligentes</h3>
            <p>Obtenha insights sobre seus hábitos financeiros com gráficos e relatórios detalhados.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
