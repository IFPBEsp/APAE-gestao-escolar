'use client'

import { UserPlus, Users, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  const cards = [
    {
      id: "gerenciar-professores",
      icon: UserPlus,
      title: "Gerenciar Professores",
      description: "Adicione e gerencie professores do sistema",
      route: "/admin/professores",
    },
    {
      id: "gerenciar-turmas",
      icon: Users, 
      title: "Gerenciar Turmas",
      description: "Organize e administre as turmas",
      route: "/admin/turmas",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[#0D4F97]">Painel do Administrador</h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-lg border-2 border-[#B2D7EC] bg-white px-4 py-2 text-[#0D4F97] transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="flex flex-col overflow-hidden rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                    <Icon className="h-6 w-6 text-[#0D4F97]" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 text-[#0D4F97]">{card.title}</h3>
                  <p className="text-[#222222]">{card.description}</p>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => router.push(card.route)}
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0D4F97] px-4 text-center text-white transition-all hover:bg-[#FFD000] hover:text-[#0D4F97]"
                  >
                    Acessar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}