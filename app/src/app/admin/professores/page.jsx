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
      route: "/admin/professores/cadastrar",
    },
    {
      id: "visualizar",
      icon: Eye,
      title: "Ver Informações",
      description: "Consultar dados dos professores",
      route: "/admin/professores/visualizar",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-[#0D4F97] transition-colors hover:text-[#FFD000]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>

        {/* Card Principal */}
        <Card className="rounded-2xl border border-[#B2D7EC] bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold text-[#0D4F97]">
              Gerenciar Professores
            </CardTitle>
            <CardDescription className="text-[#222222] text-base">
              Escolha uma ação para gerenciar os professores
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-10">
            {/* Ações */}
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.id}
                    className="flex w-full max-w-[480px] flex-col justify-between overflow-hidden rounded-2xl border border-[#B2D7EC] bg-white shadow-md transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center px-10 pt-10 pb-8 text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                        <Icon className="h-8 w-8 text-[#0D4F97]" strokeWidth={2.2} />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-[#0D4F97]">
                        {action.title}
                      </h3>
                      <p className="text-sm text-[#222222] leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                    <div className="px-10 pb-8">
                      <button
                        onClick={() => router.push(action.route)}
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0D4F97] text-white font-medium transition-colors hover:bg-[#FFD000] hover:text-[#0D4F97]"
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
