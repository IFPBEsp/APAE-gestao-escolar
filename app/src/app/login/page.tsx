'use client'

import { useSearchParams } from 'next/navigation';
import LoginComponent from '@/components/Login';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo'); 

  return <LoginComponent tipoPredefinido={tipo} />;
}

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}