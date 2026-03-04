
import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import LandingHeader from '../components/layout/LandingHeader';
import { FaCalculator, FaBullseye, FaChartBar } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <>
      <LandingHeader />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>
              Controle suas finanças com <span className={styles.appName}>MoneyForge</span>
            </h1>
            <p className={styles.description}>
              A plataforma completa para organizar suas despesas, planejar orçamentos e alcançar seus objetivos financeiros.
            </p>
            <Link href="/login" legacyBehavior>
              <a className={styles.ctaButton}>Comece Agora</a>
            </Link>
          </div>
        </main>

        <section className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <FaCalculator className={styles.icon} />
              </div>
              <h3>Planejamento de Orçamento</h3>
              <p>Crie orçamentos mensais e acompanhe seus gastos em tempo real para nunca mais perder o controle.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <FaBullseye className={styles.icon} />
              </div>
              <h3>Metas Financeiras</h3>
              <p>Defina e acompanhe metas de economia, como uma viagem, um carro novo ou sua aposentadoria.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <FaChartBar className={styles.icon} />
              </div>
              <h3>Relatórios Detalhados</h3>
              <p>Visualize relatórios claros e intuitivos que mostram para onde seu dinheiro está indo a cada mês.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
