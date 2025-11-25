'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

// Dados mockados de professores conforme o design do Figma
const mockProfessores = [
  {
    id: 1,
    nome: "Maria Silva",
    status: "Ativo",
    turmas: [
      "Alfabetização 2023 - Manhã",
      "Matemática Básica 2023 - Manhã"
    ]
  },
  {
    id: 2,
    nome: "João Santos",
    status: "Ativo",
    turmas: [
      "Língua Portuguesa 2023 - Tarde"
    ]
  },
  {
    id: 3,
    nome: "Ana Costa",
    status: "Ativo",
    turmas: [
      "Matemática Básica 2023 - Manhã"
    ]
  },
  {
    id: 4,
    nome: "Carlos Lima",
    status: "Ativo",
    turmas: [
      "Educação Física 2023 - Tarde"
    ]
  },
  {
    id: 5,
    nome: "Paula Oliveira",
    status: "Ativo",
    turmas: [
      "Alfabetização 2023 - Manhã"
    ]
  },
  {
    id: 6,
    nome: "Roberta Mendes",
    status: "Ativo",
    turmas: [
      "Estimulação 2023 - Tarde",
      "Linguagem 2023 - Tarde"
    ]
  },
];

export default function Professores() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("professores");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "inicio") {
      router.push("/admin");
    } else if (tab === "turmas") {
      router.push("/admin/turmas");
    } else if (tab === "professores") {
      router.push("/admin/professores");
    } else if (tab === "alunos") {
      // router.push("/admin/alunos"); // Quando implementado
    }
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleCadastrarProfessor = () => {
    router.push("/admin/professores/cadastrar");
  };

  return (
    <div className="flex min-h-screen bg-[#E5E5E5]">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        onToggleCollapse={handleToggleCollapse}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 mt-20 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#0D4F97] mb-2">
                  Gerenciar Professores
                </h1>
                <p className="text-[#222222]">
                  Visualize e edite a lista de professores
                </p>
              </div>
              
              {/* Botão Adicionar Professor */}
              <Button
                onClick={handleCadastrarProfessor}
                className="h-12 justify-center bg-[#0D4F97] px-6 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Adicionar Professor
              </Button>
            </div>

            {/* Grid de Cards de Professores - Layout 2x3 conforme Figma */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockProfessores.map((professor) => (
                <Card
                  key={professor.id}
                  className="rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-all hover:border-[#0D4F97] hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    {/* Avatar e Nome */}
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                        <UserCircle className="h-7 w-7 text-[#0D4F97]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-[#0D4F97] mb-1">
                          {professor.nome}
                        </h3>
                        {/* Badge de Status - Verde para Ativo */}
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                          {professor.status}
                        </span>
                      </div>
                    </div>

                    {/* Seção Turmas */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#0D4F97]" />
                        <span className="text-sm font-medium text-[#0D4F97]">Turmas</span>
                      </div>
                      <ul className="space-y-1">
                        {professor.turmas.map((turma, index) => (
                          <li key={index} className="text-sm text-[#222222]">
                            • {turma}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

