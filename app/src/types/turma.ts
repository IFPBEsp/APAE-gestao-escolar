export interface TurmaAluno {
  pacienteId: string;
  nome: string;
  ativo: boolean;
}

export interface Turma {
  id: string;
  nome: string;
  anoCriacao: number;
  turno: string;
  tipo: string;
  ativa: boolean;
  alunos: TurmaAluno[];
  horario: string;
  totalAlunosAtivos?: number;
}

export interface TurmaResumo {
  id: string;
  nome: string;
  anoCriacao?: number;
  turno?: string;
  tipo?: string;
  ativa?: boolean;
  horario?: string;
  totalAlunos?: number;
  totalAlunosAtivos?: number;
}
