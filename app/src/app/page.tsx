'use client';

import { useState } from 'react';
import Header from '@components/Header/Header';
import Home from '@components/Home/Home';
import GerenciarTurmas from '@components/GerenciarTurmas/GerenciarTurmas';
import ChamadaPage from './chamada/page';

type Page = 'home' | 'gerenciar-turmas' | 'chamada';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  const [chamadaData, setChamadaData] = useState<{ turmaId: number; turmaNome: string } | null>(null);

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page as Page);
  };

  const handleBack = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    } else {
      setCurrentPage('home');
    }
    setChamadaData(null);
  };

  const handleFazerChamada = (turmaId: number, turmaNome: string) => {
    setPreviousPage(currentPage); // Salva a página atual (gerenciar-turmas) como anterior
    setChamadaData({ turmaId, turmaNome });
    setCurrentPage('chamada');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'gerenciar-turmas':
        return <GerenciarTurmas onBack={handleBack} onFazerChamada={handleFazerChamada} />;
      case 'chamada':
        return (
          <ChamadaPage 
            onBack={handleBack} 
            initialClass={chamadaData?.turmaNome} 
          />
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };
import Link from 'next/link';
import styles from '@/components/PageTheme.module.css';

  return (
    <div className="min-h-screen bg-[#E5E5E5]">
      <Header />
      {renderCurrentPage()}
    <div className={styles.mainPage}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>Sistema de Gestão Escolar</h1>
        <p className={styles.subtitle}>Painel Principal - Gerencie professores, turmas e chamadas</p>
      </header>

      {/* Logo APAE */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logoImage}>
            <img src="/logo.APAE.jpg" alt="APAE" className={styles.logoImg} />
          </div>
          <h2 className={styles.logoText}>APAE</h2>
        </div>
      </div>

      {/* Action Cards Section */}
      <section className={styles.actionCardsSection}>
        <div className={styles.actionCardsContainer}>
          {/* Card 1 - Cadastrar Professor */}
          <div className={styles.actionCard}>
            <div className={styles.actionCardIcon} style={{backgroundColor: '#059669'}}>
              <span className={styles.plusIcon}>+</span>
            </div>
            <h3 className={styles.actionCardTitle}>Cadastrar Professor</h3>
            <p className={styles.actionCardDescription}>Adicione novos professores ao sistema</p>
            <Link href="/professores" className={styles.actionCardButton}>
              Acessar Cadastro
            </Link>
          </div>

          {/* Card 2 - Gerenciar Turmas */}
          <div className={styles.actionCard}>
            <div className={styles.actionCardIcon} style={{backgroundColor: '#059669'}}>
              <span className={styles.plusIcon}>+</span>
            </div>
            <h3 className={styles.actionCardTitle}>Gerenciar Turmas</h3>
            <p className={styles.actionCardDescription}>Organize turmas e associe professores</p>
            <button className={styles.actionCardButton} disabled>
              Gerenciar Turmas
            </button>
          </div>

          {/* Card 3 - Fazer Chamada */}
          <div className={styles.actionCard}>
            <div className={styles.actionCardIcon} style={{backgroundColor: '#8b5cf6'}}>
              <span className={styles.plusIcon}>+</span>
            </div>
            <h3 className={styles.actionCardTitle}>Fazer Chamada</h3>
            <p className={styles.actionCardDescription}>Registre a presença dos alunos</p>
            <button className={styles.actionCardButton} disabled>
              Iniciar Chamada
            </button>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className={styles.infoCardsSection}>
        <div className={styles.infoCardsContainer}>
          {/* Card 1 - Resumo */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Resumo</h3>
            <div className={styles.infoCardContent}>
              <p>3 Professores cadastrados</p>
              <p>2 Turmas ativas</p>
            </div>
          </div>

          {/* Card 2 - Data Atual */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Data Atual</h3>
            <div className={styles.infoCardContent}>
              <p>Segunda-feira, 13 de Outubro de 2025</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}