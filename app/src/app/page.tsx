'use client'

import { UserCog, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function RoleSelectionPage() {
  const router = useRouter();

  const roles = [
    {
      id: "admin",
      icon: UserCog,
      title: "Sou Administrador",
      description: "Gerenciar professores, turmas e sistema",
      route: "/admin",
    },
    {
      id: "professor",
      icon: GraduationCap,
      title: "Sou Professor",
      description: "Acessar minhas turmas e fazer chamadas",
      route: "/professor",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#E5E5E5] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-[#0D4F97]">Selecione seu perfil</h1>
          <p className="text-[#222222]">Escolha como você deseja acessar o sistema</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="flex flex-col overflow-hidden rounded-xl border-2 border-[#B2D7EC] bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B2D7EC]/20">
                    <Icon className="h-6 w-6 text-[#0D4F97]" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 text-[#0D4F97]">{role.title}</h3>
                  <p className="text-[#222222]">{role.description}</p>
                </div>
                <div className="p-6 pt-0">
                  <Button
                    onClick={() => router.push(role.route)}
                    className="w-full"
                    variant="primary"
                  >
                    Acessar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}