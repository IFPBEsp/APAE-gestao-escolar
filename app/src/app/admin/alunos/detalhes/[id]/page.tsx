'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, BookOpen, Heart, Phone } from "lucide-react";
import router from "next/router";

export default function DetalhesDoAluno({ params }) {
  const id = params;
  return (
    <div className="flex w-full h-full">
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topo azul */}
        <div className="bg-[#0A57A0] text-white px-10 py-6 shadow-md">
          <h1 className="text-3xl font-bold">Detalhes do Aluno</h1>
        </div>

        {/* Conteúdo */}
        <div className="px-[50px] py-[30px] space-y-8">
          {/* Botão voltar */}
          <Button
            variant="outline"
            onClick={() => router.push("/admin/alunos")}
            className="flex items-center gap-2 border-[#0A57A0] text-[#0A57A0] hover:bg-blue-50"
          >
            <ArrowLeft size={18} /> Voltar para Alunos
          </Button>

          {/* Card principal */}
          <Card className="border border-blue-200 shadow-md rounded-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <User size={40} className="text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ana Silva</h2>
                    <p className="text-gray-600 text-lg">12 anos</p>
                  </div>
                </div>

                <Button className="bg-[#0A57A0] hover:bg-blue-800 text-white">
                  Editar Aluno
                </Button>
              </div>

              {/* Infos */}
              <div className="grid grid-cols-2 gap-y-6 mt-10 text-gray-800">
                <div className="flex gap-3">
                  <Calendar className="text-blue-700" />
                  <div>
                    <p className="font-semibold">Data de Nascimento</p>
                    <p>15/03/2013</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <BookOpen className="text-blue-700" />
                  <div>
                    <p className="font-semibold">Turma Atual</p>
                    <p>Alfabetização 2025 - Manhã</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Heart className="text-blue-700" />
                  <div>
                    <p className="font-semibold">Deficiência</p>
                    <p>Síndrome de Down</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar className="text-blue-700" />
                  <div>
                    <p className="font-semibold">Data de Matrícula</p>
                    <p>05/02/2025</p>
                  </div>
                </div>

                <div className="flex gap-3 col-span-2">
                  <Phone className="text-blue-700" />
                  <div>
                    <p className="font-semibold">Responsável</p>
                    <p>Maria Silva (Mãe)</p>
                    <p>(11) 98765-4321</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Avaliações */}
          <Card className="border border-blue-200 shadow-md rounded-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">Histórico de Avaliações</h2>
              <p className="text-gray-600 mb-6">Avaliações realizadas pelos professores (3 registros)</p>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-semibold text-gray-700">Data</th>
                    <th className="pb-3 font-semibold text-gray-700">Professor</th>
                    <th className="pb-3 font-semibold text-gray-700">Turma</th>
                    <th className="pb-3 font-semibold text-gray-700">Descrição</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr className="border-b">
                    <td className="py-4">05/11/2025</td>
                    <td>Prof. Maria Silva</td>
                    <td>Alfabetização 2025 - Manhã</td>
                    <td>Demonstrou excelente progresso na leitura de sílabas simples. Participou ativamente das atividades em grupo.</td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-4">28/10/2025</td>
                    <td>Prof. Maria Silva</td>
                    <td>Alfabetização 2025 - Manhã</td>
                    <td>Conseguiu identificar todas as vogais e está começando a formar palavras simples. Ótima coordenação motora.</td>
                  </tr>

                  <tr>
                    <td className="py-4">15/10/2025</td>
                    <td>Prof. João Santos</td>
                    <td>Estimulação 2025 - Tarde</td>
                    <td>Mostrou melhora significativa na concentração durante as atividades de estimulação sensorial.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
