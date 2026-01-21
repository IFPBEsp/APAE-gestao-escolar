export interface Turma {
  id: number;
  nome: string;
  anoCriacao?: number;
  turno?: string;
  tipo?: string;
  isAtiva?: boolean;
  professor?: {
    id: number;
    nome: string;
  };
}

export interface Professor {
  id: number;
  nome: string;
  cpf?: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  formacao?: string;
  dataContratacao: string; 
  turmas?: Turma[] | string[]; 
  ativo: boolean;
}

export interface ProfessorModalProps {
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
  ativo: boolean;
}