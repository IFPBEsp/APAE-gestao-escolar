"use client";

import { useRouter } from 'next/navigation';
import Home from '@/components/Home';

export default function Page() {
  const router = useRouter();
  return (
    <Home
      onNavigate={(page) => {
        if (page === 'cadastrar-professor') router.push('/professores');
        else if (page === 'gerenciar-turmas') router.push('/turmas');
      }}
    />
  );
}