'use client'

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfessorSidebar from "@/components/Sidebar/ProfessorSidebar";
import Chamada from "@/components/Chamada";
import { Button } from "@/components/ui/button";

const turmaNomes = { 
    "1": "Educação Especial 2025 MANHA", 
    "2": "Estimulação 2025 - Tarde" 
};


export default function ChamadaPage() {
  const router = useRouter();
  const params = useParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const turmaId = params?.turmaId ? String(params.turmaId) : null;
  
  const turmaNome = turmaId ? turmaNomes[turmaId as keyof typeof turmaNomes] : null;
  
  const handleBack = () => router.push("/professor/turmas");
  
  const handleSaveSuccess = () => {
      setTimeout(() => router.push("/professor/turmas"), 1500);
  };


  if (!turmaId || !turmaNome) {
    return (
      <div className="flex min-h-screen bg-[#E5E5E5] items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border-2 border-[#B2D7EC] text-center shadow-md">
          <h2 className="text-[#0D4F97] text-2xl font-bold mb-4">Turma não identificada</h2>
          <Button onClick={() => router.push("/professor/turmas")} className="bg-[#0D4F97]"> Voltar </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      <ProfessorSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Chamada 
          turmaIdProp={turmaId} 
          turmaNomeProp={turmaNome} 
          
          onBack={handleBack}
          onSaveSuccess={handleSaveSuccess}
          
        />
      </main>
    </div>
  );
}