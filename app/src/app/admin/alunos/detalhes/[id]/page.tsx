'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, BookOpen, Heart, Phone, Eye, PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalEditarAluno from "@/components/alunos/ModalEditarAluno";

export default function DetalhesDoAluno({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock de dados do aluno (inicializado como estado para permitir edição)
  const [alunoData, setAlunoData] = useState({
    id: 1,
    nome: "Ana Silva",
    idade: 12,
    dataNascimento: "15/03/2013",
    deficiencia: "Síndrome de Down",
    responsavel: "Maria Silva (Mãe)",
    telefoneResponsavel: "(11) 98765-4321",
    turmaAtual: "Alfabetização 2025 - Manhã",
    turmaId: 1,
    dataMatricula: "05/02/2025"
  });

  const handleSaveAluno = (alunoAtualizado: any) => {
    setAlunoData(alunoAtualizado);
  };

  return (
    <div className="w-full">
      {/* Topo azul */}
      <div className="bg-[#0D4F97] text-white px-8 py-4 shadow-sm">
        <h1 className="text-xl font-bold">Detalhes do Aluno</h1>
      </div>

      {/* Conteúdo */}
      <div className="px-[50px] py-[30px] space-y-8">
        {/* Botão voltar */}
        <Button
          variant="outline"
          onClick={() => router.push("/admin/alunos")}
          className="flex items-center gap-2 border-[#B2D7EC] text-[#0D4F97] hover:bg-blue-50"
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
                  <h2 className="text-2xl font-bold text-[#0D4F97]">{alunoData.nome}</h2>
                  <p className="text-gray-600 text-lg">{alunoData.idade} anos</p>
                </div>
              </div>

              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-[#0D4F97] hover:bg-[#0A4080] text-white px-6"
              >
                <PenSquare size={18} />
                Editar Aluno
              </Button>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-2 gap-y-6 mt-10 text-gray-800">
              <div className="flex gap-3">
                <Calendar className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Data de Nascimento</p>
                  <p>{alunoData.dataNascimento}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <BookOpen className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Turma Atual</p>
                  <p>{alunoData.turmaAtual}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Heart className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Deficiência</p>
                  <p>{alunoData.deficiencia}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Data de Matrícula</p>
                  <p>{alunoData.dataMatricula}</p>
                </div>
              </div>

              <div className="flex gap-3 col-span-2">
                <Phone className="text-[#0D4F97]" />
                <div>
                  <p className="font-semibold text-[#0D4F97]">Responsável</p>
                  <p>{alunoData.responsavel}</p>
                  <p>{alunoData.telefoneResponsavel}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ... (Evaluation History Table remains the same) ... */}
        {/* ... (Reports History Table remains the same) ... */}
        <Card className="border border-blue-200 shadow-md rounded-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0D4F97] mb-2">Histórico de Avaliações</h2>
            <p className="text-gray-600 mb-6">Avaliações realizadas pelos professores (3 registros)</p>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-bold text-[#0D4F97]">Data</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Professor</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Turma</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Descrição</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">05/11/2025</td>
                  <td className="font-medium text-gray-900">Prof. Maria Silva</td>
                  <td className="text-gray-600">Alfabetização 2025 - Manhã</td>
                  <td className="text-gray-600">Demonstrou excelente progresso na leitura de sílabas simples. Participou ativamente das atividades em grupo.</td>
                  <td><Eye className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]" /></td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">28/10/2025</td>
                  <td className="font-medium text-gray-900">Prof. Maria Silva</td>
                  <td className="text-gray-600">Alfabetização 2025 - Manhã</td>
                  <td className="text-gray-600">Conseguiu identificar todas as vogais e está começando a formar palavras simples. Ótima coordenação motora.</td>
                  <td><Eye className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]" /></td>
                </tr>

                <tr>
                  <td className="py-4 font-medium text-gray-900">15/10/2025</td>
                  <td className="font-medium text-gray-900">Prof. João Santos</td>
                  <td className="text-gray-600">Estimulação 2025 - Tarde</td>
                  <td className="text-gray-600">Mostrou melhora significativa na concentração durante as atividades de estimulação sensorial.</td>
                  <td><Eye className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]" /></td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Histórico de Relatórios Individuais */}
        <Card className="border border-blue-200 shadow-md rounded-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0D4F97] mb-2">Histórico de Relatórios Individuais</h2>
            <p className="text-gray-600 mb-6">Relatórios individuais realizados pelos professores (3 registros)</p>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-bold text-[#0D4F97]">Data</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Professor</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Turma</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Atividades</th>
                  <th className="pb-3 font-bold text-[#0D4F97]">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">15/11/2025</td>
                  <td className="font-medium text-gray-900">Prof. Maria Silva</td>
                  <td className="text-gray-600">Alfabetização 2025 - Manhã</td>
                  <td className="text-gray-600">Atividades em grupo com jogos cooperativos e brincadeiras dirigidas.</td>
                  <td><Eye className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]" /></td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">10/11/2025</td>
                  <td className="font-medium text-gray-900">Prof. Maria Silva</td>
                  <td className="text-gray-600">Alfabetização 2025 - Manhã</td>
                  <td className="text-gray-600">Atividades de escrita do nome com apoio de modelos visuais e tracejados.</td>
                  <td><Eye className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]" /></td>
                </tr>

                <tr>
                  <td className="py-4 font-medium text-gray-900">05/11/2025</td>
                  <td className="font-medium text-gray-900">Prof. Maria Silva</td>
                  <td className="text-gray-600">Alfabetização 2025 - Manhã</td>
                  <td className="text-gray-600">Atividades de coordenação motora fina, incluindo desenho livre, recorte e colagem.</td>
                  <td><Eye className="h-5 w-5 text-[#B2D7EC] cursor-pointer hover:text-[#0D4F97]" /></td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <ModalEditarAluno
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          aluno={alunoData}
          onSave={handleSaveAluno}
        />
      </div>
    </div>
  );
}

