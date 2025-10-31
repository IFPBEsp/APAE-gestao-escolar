'use client'

import { UserCog, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

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
      disabled: true,
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
                className={`flex flex-col overflow-hidden rounded-xl border-2 bg-white shadow-md transition-shadow ${
                  role.disabled
                    ? 'border-gray-300 opacity-60 cursor-not-allowed'
                    : 'border-[#B2D7EC] hover:shadow-lg'
                }`}
              >
                <div className="flex flex-1 flex-col items-center p-8 text-center">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
                    role.disabled ? 'bg-gray-200' : 'bg-[#B2D7EC]/20'
                  }`}>
                    <Icon className={`h-6 w-6 ${role.disabled ? 'text-gray-400' : 'text-[#0D4F97]'}`} strokeWidth={2} />
                  </div>
                  <h3 className={`mb-3 ${role.disabled ? 'text-gray-400' : 'text-[#0D4F97]'}`}>{role.title}</h3>
                  <p className={`${role.disabled ? 'text-gray-400' : 'text-[#222222]'}`}>{role.description}</p>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => !role.disabled && router.push(role.route)}
                    disabled={role.disabled}
                    className={`flex h-12 w-full items-center justify-center rounded-lg px-4 text-center transition-all ${
                      role.disabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]'
                    }`}
                  >
                    {role.disabled ? 'Em Breve' : 'Acessar'}
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