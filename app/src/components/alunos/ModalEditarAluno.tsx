import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCircle, Calendar, Heart, User, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ModalEditarAlunoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (alunoAtualizado: any) => void;
    aluno: {
        id: number;
        nome: string;
        idade: number;
        dataNascimento: string;
        deficiencia: string;
        responsavel: string;
        telefoneResponsavel: string;
        turmaAtual: string;
        turmaId: number;
        dataMatricula: string;
    };
}

// Dados simulados para turmas disponíveis
const mockTurmasDisponiveis = [
    { id: 1, nome: "Alfabetização 2025 - Manhã" },
    { id: 2, nome: "Matemática Básica 2025 - Manhã" },
    { id: 3, nome: "Estimulação 2025 - Tarde" },
    { id: 4, nome: "Educação Física 2025 - Tarde" },
    { id: 5, nome: "Artes 2025 - Manhã" },
    { id: 6, nome: "Música 2025 - Tarde" },
];

// Lista de sugestões de deficiências
const sugestoesDeficiencia = [
    "Síndrome de Down",
    "Autismo (TEA)",
    "Paralisia Cerebral",
    "Deficiência Intelectual",
    "Deficiência Auditiva",
    "Deficiência Visual",
    "Deficiência Física",
    "TDAH",
    "Dislexia",
    "Múltipla Deficiência"
];

export default function ModalEditarAluno({ isOpen, onClose, onSave, aluno }: ModalEditarAlunoProps) {
    // Estados para os campos
    const [nome, setNome] = useState(aluno.nome);
    const [dataNascimento, setDataNascimento] = useState(
        aluno.dataNascimento.split("/").reverse().join("-") // Converter DD/MM/YYYY para YYYY-MM-DD
    );
    const [deficiencia, setDeficiencia] = useState(aluno.deficiencia);
    const [responsavel, setResponsavel] = useState(aluno.responsavel);
    const [telefoneResponsavel, setTelefoneResponsavel] = useState(aluno.telefoneResponsavel);
    const [turmaId, setTurmaId] = useState(aluno.turmaId.toString());

    // Calcular idade com base na data de nascimento
    const calcularIdade = (dataNasc: string): number => {
        if (!dataNasc) return 0;
        const hoje = new Date();
        const nascimento = new Date(dataNasc);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    // Máscara para Telefone
    const formatarTelefone = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, "");
        return apenasNumeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTelefoneResponsavel(formatarTelefone(e.target.value));
    };

    const handleSalvar = () => {
        // Validações
        if (!nome.trim()) {
            toast.error("O nome é obrigatório!");
            return;
        }

        if (!dataNascimento) {
            toast.error("A data de nascimento é obrigatória!");
            return;
        }

        const idade = calcularIdade(dataNascimento);
        if (idade < 0 || idade > 100) {
            toast.error("Data de nascimento inválida!");
            return;
        }

        if (!deficiencia.trim()) {
            toast.error("A deficiência é obrigatória!");
            return;
        }

        if (!responsavel.trim()) {
            toast.error("O responsável é obrigatório!");
            return;
        }

        if (!telefoneResponsavel || telefoneResponsavel.replace(/\D/g, "").length < 10) {
            toast.error("Telefone do responsável inválido!");
            return;
        }

        if (!turmaId) {
            toast.error("Selecione uma turma!");
            return;
        }

        // Preparar objeto atualizado
        const alunoAtualizado = {
            ...aluno,
            nome,
            dataNascimento: dataNascimento.split("-").reverse().join("/"), // Voltando para DD/MM/YYYY
            idade: calcularIdade(dataNascimento),
            deficiencia,
            responsavel,
            telefoneResponsavel,
            turmaId: parseInt(turmaId),
            turmaAtual: mockTurmasDisponiveis.find(t => t.id === parseInt(turmaId))?.nome || ""
        };

        onSave(alunoAtualizado);
        toast.success("Alterações salvas com sucesso!");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-xl border-2 border-[#B2D7EC]">
                <DialogHeader>
                    <DialogTitle className="text-[#0D4F97]">Editar Dados Cadastrais do Aluno</DialogTitle>
                    <DialogDescription className="text-[#222222]">Preencha os campos abaixo para atualizar as informações do aluno.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informações Pessoais */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-[#0D4F97]" />
                            <h3 className="text-[#0D4F97]">Informações Pessoais</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Nome */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="nome" className="text-[#0D4F97]">
                                    Nome Completo <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nome"
                                    placeholder="Ex: Ana Silva"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97] bg-gray-100 cursor-not-allowed text-gray-500"
                                    disabled
                                />
                            </div>

                            {/* Data de Nascimento */}
                            <div className="space-y-2">
                                <Label htmlFor="data-nascimento" className="text-[#0D4F97]">
                                    Data de Nascimento <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="data-nascimento"
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97] bg-gray-100 cursor-not-allowed text-gray-500"
                                    disabled
                                />
                            </div>

                            {/* Idade (Calculada) */}
                            <div className="space-y-2">
                                <Label className="text-[#0D4F97]">Idade</Label>
                                <div className="flex h-10 items-center rounded-lg border-2 border-[#B2D7EC] bg-gray-50 px-3 text-[#222222]">
                                    {calcularIdade(dataNascimento)} anos
                                </div>
                            </div>

                            {/* Deficiência */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="deficiencia" className="text-[#0D4F97]">
                                    Deficiência <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="deficiencia"
                                    list="sugestoes-deficiencia"
                                    placeholder="Ex: Síndrome de Down"
                                    value={deficiencia}
                                    onChange={(e) => setDeficiencia(e.target.value)}
                                    className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                                />
                                <datalist id="sugestoes-deficiencia">
                                    {sugestoesDeficiencia.map((def) => (
                                        <option key={def} value={def} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    {/* Informações do Responsável */}
                    <div className="space-y-4 border-t-2 border-[#B2D7EC] pt-6">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-[#0D4F97]" />
                            <h3 className="text-[#0D4F97]">Informações do Responsável</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Responsável */}
                            <div className="space-y-2">
                                <Label htmlFor="responsavel" className="text-[#0D4F97]">
                                    Nome do Responsável <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="responsavel"
                                    placeholder="Ex: Maria Silva (Mãe)"
                                    value={responsavel}
                                    onChange={(e) => setResponsavel(e.target.value)}
                                    className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                                />
                            </div>

                            {/* Telefone do Responsável */}
                            <div className="space-y-2">
                                <Label htmlFor="telefone-responsavel" className="text-[#0D4F97]">
                                    Telefone do Responsável <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="telefone-responsavel"
                                    placeholder="(00) 00000-0000"
                                    value={telefoneResponsavel}
                                    onChange={handleTelefoneChange}
                                    maxLength={15}
                                    className="border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informações Acadêmicas */}
                    <div className="space-y-4 border-t-2 border-[#B2D7EC] pt-6">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#0D4F97]" />
                            <h3 className="text-[#0D4F97]">Informações Acadêmicas</h3>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="turma" className="text-[#0D4F97]">
                                Turma Atual <span className="text-red-500">*</span>
                            </Label>
                            <Select value={turmaId} onValueChange={setTurmaId}>
                                <SelectTrigger className="h-12 border-2 border-[#B2D7EC] focus:border-[#0D4F97] focus:ring-[#0D4F97] cursor-pointer">
                                    <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {mockTurmasDisponiveis.map((turma) => (
                                        <SelectItem key={turma.id} value={turma.id.toString()} className="cursor-pointer">
                                            {turma.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[#222222]">
                                Selecione a turma em que o aluno está matriculado atualmente
                            </p>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-3 border-t-2 border-[#B2D7EC] pt-6 md:flex-row md:justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-12 justify-center border-2 border-[#B2D7EC] px-8 text-[#0D4F97] hover:bg-[#B2D7EC]/20"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSalvar}
                            className="h-12 justify-center bg-[#0D4F97] px-8 text-white hover:bg-[#FFD000] hover:text-[#0D4F97]"
                        >
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
