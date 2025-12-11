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

interface Professor {
  id: number;
  nome: string;
  cpf?: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  especialidade?: string;
  dataContratacao?: string;
  turmas?: Array<{ id: number; nome: string } | string>;
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
    especialidade: "",
    dataContratacao: "",
  });
  const [turmasVinculadas, setTurmasVinculadas] = useState<string[]>([]);
  const [novaTurma, setNovaTurma] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sugestoesTurmas, setSugestoesTurmas] = useState<string[]>([]);

  // Mock de turmas disponíveis para o autocomplete
  const mockTurmasDisponiveis = [
    "Alfabetização 2025 - Manhã",
    "Alfabetização 2025 - Tarde",
    "Estimulação 2025 - Manhã",
    "Estimulação 2025 - Tarde",
    "Matemática Básica 2025 - Manhã",
    "Educação Física 2025 - Tarde",
    "Artes 2025 - Manhã",
    "Música 2025 - Tarde"
  ];

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
        especialidade: professor.especialidade || "",
        dataContratacao: professor.dataContratacao
          ? format(new Date(professor.dataContratacao), "yyyy-MM-dd")
          : "",
      });

      // Processar turmas
      const turmas = professor.turmas || [];
      setTurmasVinculadas(
        turmas.map((t) => (typeof t === "object" ? t.nome || t.name : t))
      );
    }
  }, [professor, isOpen]);

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
    if (novaTurma.trim() && !turmasVinculadas.includes(novaTurma.trim())) {
      setTurmasVinculadas([...turmasVinculadas, novaTurma.trim()]);
      setNovaTurma("");
    }
  };

  const handleRemoveTurma = (index: number) => {
    setTurmasVinculadas(turmasVinculadas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.put(`/professores/${professor.id}`, formData);
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
                <Label htmlFor="especialidade" className="text-[#0D4F97]">
                  Especialidade
                </Label>
                <Input
                  id="especialidade"
                  name="especialidade"
                  value={formData.especialidade}
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
                        const filtradas = mockTurmasDisponiveis.filter(
                          (t) =>
                            t.toLowerCase().includes(searchLower) &&
                            !turmasVinculadas.includes(t)
                        );
                        setSugestoesTurmas(filtradas);
                      } else {
                        setSugestoesTurmas([]);
                      }
                    }}
                    onFocus={() => {
                      if (novaTurma.trim().length > 0) {
                        const searchLower = novaTurma.toLowerCase();
                        const filtradas = mockTurmasDisponiveis.filter(
                          (t) =>
                            t.toLowerCase().includes(searchLower) &&
                            !turmasVinculadas.includes(t)
                        );
                        setSugestoesTurmas(filtradas);
                      } else {
                        // Opcional: mostrar todas as opções válidas se vazio
                        const filtradas = mockTurmasDisponiveis.filter(t => !turmasVinculadas.includes(t));
                        setSugestoesTurmas(filtradas);
                      }
                    }}
                    // onBlur com atraso para permitir o clique na sugestão
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
                  />
                  <Button
                    type="button"
                    onClick={handleAddTurma}
                    className="h-12 bg-[#0D4F97] text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                  >
                    Adicionar
                  </Button>
                </div>
                {/* Lista de Sugestões de Autocomplete */}
                {sugestoesTurmas.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full max-w-[calc(100%-100px)] rounded-md border border-[#B2D7EC] bg-white shadow-lg">
                    <ul className="max-h-60 overflow-auto py-1">
                      {sugestoesTurmas.map((turma, index) => (
                        <li
                          key={index}
                          className="cursor-pointer px-4 py-2 hover:bg-[#E8F3FF] text-[#222222]"
                          onMouseDown={(e) => {
                            // Previne que o onBlur dispare antes do clique
                            e.preventDefault();
                          }}
                          onClick={() => {
                            setTurmasVinculadas([...turmasVinculadas, turma]);
                            setNovaTurma("");
                            setSugestoesTurmas([]);
                          }}
                        >
                          {turma}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {turmasVinculadas.length > 0 && (
              <div>
                <p className="text-sm font-medium text-[#0D4F97] mb-2">
                  Turmas Vinculadas ({turmasVinculadas.length})
                </p>
                <div className="space-y-2">
                  {turmasVinculadas.map((turma, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border-2 border-[#B2D7EC] bg-white p-3"
                    >
                      <span className="text-[#222222]">{turma}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTurma(index)}
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

