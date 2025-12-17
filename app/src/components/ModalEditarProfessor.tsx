'use client'

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { listarTurmas } from "@/services/TurmaService";
import { listarTurmasDeProfessor } from "@/services/ProfessorService";

interface Turma {
  id: number;
  nome: string;
  anoCriacao: number;
  turno: string;
  tipo: string;
  isAtiva: boolean;
  professor?: {
    id: number;
    nome: string;
  };
}

interface Professor {
  id: number;
  nome: string;
  cpf?: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  formacao?: string;
  dataContratacao?: string;
  turmas?: Turma[] | string[];
}

interface ModalEditarProfessorProps {
  isOpen: boolean;
  onClose: () => void;
  professor: Professor;
  onUpdate?: () => void;
}

export default function ModalEditarProfessor({
  isOpen,
  onClose,
  professor,
  onUpdate,
}: ModalEditarProfessorProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
    formacao: "",
    dataContratacao: "",
  });
  
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<Turma[]>([]);
  const [turmasVinculadas, setTurmasVinculadas] = useState<Turma[]>([]);
  const [novaTurma, setNovaTurma] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sugestoesTurmas, setSugestoesTurmas] = useState<Turma[]>([]);
  const [loadingTurmas, setLoadingTurmas] = useState(false);

  useEffect(() => {
    if (professor && isOpen) {
      setFormData({
        nome: professor.nome || "",
        cpf: professor.cpf || "",
        email: professor.email || "",
        telefone: professor.telefone || "",
        endereco: professor.endereco || "",
        dataNascimento: professor.dataNascimento
          ? format(new Date(professor.dataNascimento), "yyyy-MM-dd")
          : "",
        formacao: professor.formacao || "",
        dataContratacao: professor.dataContratacao
          ? format(new Date(professor.dataContratacao), "yyyy-MM-dd")
          : "",
      });

      // Buscar turmas do professor
      fetchTurmasProfessor(professor.id);
      
      // Buscar todas as turmas disponíveis
      fetchTurmasDisponiveis();
    }
  }, [professor, isOpen]);

  const fetchTurmasDisponiveis = async () => {
    try {
      setLoadingTurmas(true);
      const turmas = await listarTurmas();
      // Filtrar apenas turmas ativas
      const turmasAtivas = turmas.filter((turma: Turma) => turma.isAtiva);
      setTurmasDisponiveis(turmasAtivas);
    } catch (error) {
      console.error("Erro ao buscar turmas disponíveis:", error);
      toast.error("Erro ao carregar turmas disponíveis");
    } finally {
      setLoadingTurmas(false);
    }
  };

  const fetchTurmasProfessor = async (professorId: number) => {
    try {
      const turmas = await listarTurmasDeProfessor(professorId);
      setTurmasVinculadas(turmas);
    } catch (error) {
      console.error("Erro ao buscar turmas do professor:", error);
      // Se der erro, usa as turmas que já vieram no objeto professor
      const turmas = professor.turmas || [];
      const turmasNormalizadas = turmas.map((t: any) => 
        typeof t === "object" ? t : { 
          id: Math.random(), 
          nome: t, 
          anoCriacao: new Date().getFullYear(), 
          turno: "", 
          tipo: "", 
          isAtiva: true 
        }
      );
      setTurmasVinculadas(turmasNormalizadas);
    }
  };

  const applyCPFMask = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const masked = applyCPFMask(value);
      setFormData((prev) => ({ ...prev, cpf: masked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTurma = () => {
    if (novaTurma.trim()) {
      // Encontrar a turma pelo nome nas sugestões
      const turmaEncontrada = sugestoesTurmas.find(
        t => t.nome.toLowerCase() === novaTurma.toLowerCase()
      );
      
      if (turmaEncontrada && !turmasVinculadas.some(t => t.id === turmaEncontrada.id)) {
        setTurmasVinculadas([...turmasVinculadas, turmaEncontrada]);
        setNovaTurma("");
        setSugestoesTurmas([]);
      }
    }
  };

  const handleRemoveTurma = (id: number) => {
    setTurmasVinculadas(turmasVinculadas.filter(t => t.id !== id));
  };

  const vincularProfessorATurma = async (turmaId: number, professorId: number) => {
    try {
      await api.put(`/turmas/${turmaId}/professor/${professorId}`);
    } catch (error) {
      console.error(`Erro ao vincular turma ${turmaId}:`, error);
      throw error;
    }
  };

  const desvincularProfessorDaTurma = async (turmaId: number, professorId: number) => {
    try {
      // Nota: Este endpoint pode precisar ser criado no backend
      await api.delete(`/turmas/${turmaId}/professor/${professorId}`);
    } catch (error) {
      console.error(`Erro ao desvincular turma ${turmaId}:`, error);
      // Se não existir o endpoint, apenas loga o erro
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Atualizar dados básicos do professor
      await api.put(`/professores/${professor.id}`, formData);
      
      // 2. Buscar turmas atuais do professor para comparar
      const turmasAtuais = await listarTurmasDeProfessor(professor.id);
      const turmasAtuaisIds = turmasAtuais.map((t: Turma) => t.id);
      const turmasVinculadasIds = turmasVinculadas.map(t => t.id);
      
      // 3. Turmas para adicionar (estão em turmasVinculadas mas não em turmasAtuais)
      const turmasParaAdicionar = turmasVinculadas.filter(
        t => !turmasAtuaisIds.includes(t.id)
      );
      
      // 4. Turmas para remover (estão em turmasAtuais mas não em turmasVinculadas)
      const turmasParaRemover = turmasAtuais.filter(
        (t: Turma) => !turmasVinculadasIds.includes(t.id)
      );
      
      // 5. Adicionar novas turmas
      for (const turma of turmasParaAdicionar) {
        try {
          await vincularProfessorATurma(turma.id, professor.id);
        } catch (turmaError) {
          console.error(`Erro ao vincular turma ${turma.id}:`, turmaError);
        }
      }
      
      // 6. Remover turmas desvinculadas
      for (const turma of turmasParaRemover) {
        try {
          await desvincularProfessorDaTurma(turma.id, professor.id);
        } catch (turmaError) {
          console.error(`Erro ao desvincular turma ${turma.id}:`, turmaError);
        }
      }
      
      toast.success("Professor atualizado com sucesso!");
      onUpdate?.();
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar professor:", error);
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar professor";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0D4F97]">
            Editar Informações do Professor
          </DialogTitle>
          <DialogDescription className="text-[#222222]">
            Atualize as informações do professor conforme necessário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais e de Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0D4F97]">
              Informações Pessoais e de Contato
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="nome" className="text-[#0D4F97]">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="cpf" className="text-[#0D4F97]">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                  placeholder="123.456.789-00"
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento" className="text-[#0D4F97]">
                  Data de Nascimento <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D4F97]" />
                  <Input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    required
                    className="h-12 pl-10 border-2 border-[#B2D7EC]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-[#0D4F97]">
                  E-mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                />
              </div>

              <div>
                <Label htmlFor="telefone" className="text-[#0D4F97]">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="h-12 border-2 border-[#B2D7EC]"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <Label htmlFor="endereco" className="text-[#0D4F97]">
                  Endereço <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  className="h-12 border-2 border-[#B2D7EC]"
                  placeholder="Rua das Flores, 123 - São Paulo/SP"
                />
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0D4F97]">
              Informações Profissionais
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="formacao" className="text-[#0D4F97]">
                  Formação
                </Label>
                <Input
                  id="formacao"
                  name="formacao"
                  value={formData.formacao}
                  onChange={handleChange}
                  className="h-12 border-2 border-[#B2D7EC]"
                  placeholder="Pedagogia Especial"
                />
              </div>

              <div>
                <Label htmlFor="dataContratacao" className="text-[#0D4F97]">
                  Data de Contratação <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D4F97]" />
                  <Input
                    id="dataContratacao"
                    name="dataContratacao"
                    type="date"
                    value={formData.dataContratacao}
                    onChange={handleChange}
                    required
                    className="h-12 pl-10 border-2 border-[#B2D7EC]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Turmas que Leciona */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0D4F97]">
              Turmas que Leciona
            </h3>

            <div>
              <Label htmlFor="novaTurma" className="text-[#0D4F97]">
                Adicionar Turma
              </Label>
              <div className="relative">
                <div className="flex gap-2">
                  <Input
                    id="novaTurma"
                    value={novaTurma}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNovaTurma(value);
                      if (value.trim().length > 0) {
                        const searchLower = value.toLowerCase();
                        const filtradas = turmasDisponiveis.filter(
                          (t) =>
                            t.nome.toLowerCase().includes(searchLower) &&
                            !turmasVinculadas.some(tv => tv.id === t.id)
                        );
                        setSugestoesTurmas(filtradas);
                      } else {
                        setSugestoesTurmas([]);
                      }
                    }}
                    onFocus={() => {
                      if (novaTurma.trim().length > 0) {
                        const searchLower = novaTurma.toLowerCase();
                        const filtradas = turmasDisponiveis.filter(
                          (t) =>
                            t.nome.toLowerCase().includes(searchLower) &&
                            !turmasVinculadas.some(tv => tv.id === t.id)
                        );
                        setSugestoesTurmas(filtradas);
                      } else {
                        // Mostrar todas as turmas disponíveis que não estão vinculadas
                        const filtradas = turmasDisponiveis.filter(t => 
                          !turmasVinculadas.some(tv => tv.id === t.id)
                        );
                        setSugestoesTurmas(filtradas);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setSugestoesTurmas([]), 200);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTurma();
                      }
                    }}
                    className="h-12 border-2 border-[#B2D7EC]"
                    placeholder="Busque e selecione a turma..."
                    autoComplete="off"
                    disabled={loadingTurmas}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTurma}
                    className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                    disabled={loadingTurmas || !novaTurma.trim()}
                  >
                    {loadingTurmas ? "Carregando..." : "Adicionar"}
                  </Button>
                </div>
                {/* Lista de Sugestões de Autocomplete */}
                {sugestoesTurmas.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full max-w-[calc(100%-100px)] rounded-md border border-[#B2D7EC] bg-white shadow-lg">
                    <ul className="max-h-60 overflow-auto py-1">
                      {sugestoesTurmas.map((turma) => (
                        <li
                          key={turma.id}
                          className="cursor-pointer px-4 py-2 hover:bg-[#E8F3FF] text-[#222222]"
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                          onClick={() => {
                            setTurmasVinculadas([...turmasVinculadas, turma]);
                            setNovaTurma("");
                            setSugestoesTurmas([]);
                          }}
                        >
                          <div>
                            <div className="font-medium">{turma.nome}</div>
                            <div className="text-sm text-gray-500">
                              {turma.turno} • {turma.tipo}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {loadingTurmas && (
                <div className="mt-2 text-sm text-gray-500">
                  Carregando turmas disponíveis...
                </div>
              )}
            </div>

            {turmasVinculadas.length > 0 && (
              <div>
                <p className="text-sm font-medium text-[#0D4F97] mb-2">
                  Turmas Vinculadas ({turmasVinculadas.length})
                </p>
                <div className="space-y-2">
                  {turmasVinculadas.map((turma) => (
                    <div
                      key={turma.id}
                      className="flex items-center justify-between rounded-lg border-2 border-[#B2D7EC] bg-white p-3"
                    >
                      <div>
                        <span className="text-[#222222] font-medium">{turma.nome}</span>
                        <div className="text-sm text-gray-500">
                          {turma.turno} • {turma.tipo}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTurma(turma.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
