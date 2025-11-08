'use client'

import { ArrowLeft, UserPlus, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function GerenciarProfessoresPage() {
  const router = useRouter();

  const actions = [
    {
      id: "adicionar",
      icon: UserPlus,
      title: "Adicionar Professor",
      description: "Cadastrar um novo professor no sistema",
      route: "/admin/professores/cadastrar", // ✅ Rota Next.js
    },
    {
      id: "visualizar",
      icon: Eye,
      title: "Ver Informações", 
      description: "Consultar dados dos professores",
      route: "/admin/professores/visualizar", // ✅ Rota Next.js
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()} // ✅ Next.js router
          className="mb-6 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>

        <Card className="rounded-xl border-2 border-[#B2D7EC] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#0D4F97]">Gerenciar Professores</CardTitle>
            <CardDescription className="text-[#222222]">
              Escolha uma ação para gerenciar os professores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.id}
                    className="flex flex-col overflow-hidden rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="flex flex-1 flex-col items-center p-6 text-center">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                        <Icon className="h-6 w-6 text-[#0D4F97]" strokeWidth={2} />
                      </div>
                      <h3 className="mb-3 text-[#0D4F97]">{action.title}</h3>
                      <p className="text-[#222222]">{action.description}</p>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => router.push(action.route)} // ✅ Next.js navigation
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0D4F97] px-4 text-center text-white transition-all hover:bg-[#FFD000] hover:text-[#0D4F97]"
                      >
                        Acessar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
