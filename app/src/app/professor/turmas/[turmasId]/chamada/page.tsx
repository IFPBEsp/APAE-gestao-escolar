'use client'

import { useSearchParams } from "next/navigation";
import Chamada from "@/components/Chamada";
import { useRouter } from "next/navigation";

export default function ChamadaPage() {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  
  const dataParam = searchParams.get('data');
  const descricao = searchParams.get('descricao');
  
  const data = dataParam ? new Date(dataParam) : new Date();
  const turmaNome = searchParams.get('turmaNome') || "Turma Selecionada";

  const handleBack = () => {
    router.push('/professor');
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleNavigateToDashboard = (tab: string) => {
    router.push(`/professor#${tab}`);
  };

  return (
    <Chamada
      onBack={handleBack}
      initialClass={turmaNome}
      onLogout={handleLogout}
      onNavigateToDashboard={handleNavigateToDashboard}
      data={data}
      descricao={descricao || ""}
    />
  );
}