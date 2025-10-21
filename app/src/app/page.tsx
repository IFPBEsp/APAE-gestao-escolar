'use client';

import { useState } from 'react';
import Header from '@components/Header/Header';
import Home from '@components/Home/Home';
import GerenciarTurmas from '@components/GerenciarTurmas/GerenciarTurmas';
import Chamada from '@components/Chamada/Chamada';

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
          <Chamada 
            onBack={handleBack} 
            initialClass={chamadaData?.turmaNome} 
          />
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5]">
      <Header />
      {renderCurrentPage()}
    </div>
  );
}