'use client';

import { Suspense } from 'react';
import PrimeiroAcessoComponent from "@/components/PrimeiroAcesso";

function PrimeiroAcessoContent() {
  return <PrimeiroAcessoComponent />;
}

export default function PrimeiroAcessoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PrimeiroAcessoContent />
    </Suspense>
  );
}