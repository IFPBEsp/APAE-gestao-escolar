import { Professor } from './professor';

export interface TurmaAluno {
  alunoId: number;
  nome: string;
  isAtivo: boolean;
}

export interface Turma {
  id: number;
  nome: string;
  anoCriacao: number;
  turno: string;
  tipo: string;
  isAtiva: boolean;
  professor?: Professor;
  alunos: TurmaAluno[];
  horario: string;
}

export interface TurmaResumo {
  id: number;
  nome: string;
}