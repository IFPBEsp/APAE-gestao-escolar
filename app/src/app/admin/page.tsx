"use client";

import { useState, useEffect } from "react";
import { User, Users, GraduationCap, TrendingUp } from "lucide-react";

export default function AdminHomePage() {
  const [totalAlunos, setTotalAlunos] = useState(20);
  const [totalTurmas, setTotalTurmas] = useState(6);
  const [totalProfessores, setTotalProfessores] = useState(12);
  const [ultimaAtividade, setUltimaAtividade] = useState("20/11/2025 - 14:30");

  const cards = [
    {
      icon: User,
      title: "Total de Alunos",
      value: totalAlunos,
    },
    {
      icon: Users,
      title: "Total de Turmas",
      value: totalTurmas,
    },
    {
      icon: GraduationCap,
      title: "Total de Professores",
      value: totalProfessores,
    },
    {
      icon: TrendingUp,
      title: "Última Atividade",
      value: ultimaAtividade,
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#0D4F97] mb-6">
        Painel do Administrador
      </h1>

      <p className="text-[#222222] mb-8">
        Visão geral do sistema APAE Esperança
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;

          return (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-[#B2D7EC] shadow-sm"
            >
              <Icon className="text-[#0D4F97] mb-4" size={28} strokeWidth={2} />
              <p className="text-[#0D4F97] font-semibold">{card.title}</p>
              <p className="text-lg text-[#222222]">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#B2D7EC] shadow-sm">
        <p className="text-[#0D4F97] font-semibold mb-2">
          Bem-vindo ao Sistema APAE
        </p>
        <p className="text-[#222222]">
          Gerencie turmas, professores e acompanhe o desempenho dos alunos através do menu lateral.
        </p>
      </div>
    </>
  );
}
