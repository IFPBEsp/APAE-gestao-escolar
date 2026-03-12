export interface Professor {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  formacao?: string;
  dataContratacao: string;
  endereco?: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
  turmas: string[];
}

export interface ProfessorResumo {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  ativo: boolean;
  turmas: string[];
  //campos opcionais
  telefone?: string;
  formacao?: string;
  dataContratacao?: string;
  dataNascimento?: string;
  endereco?: string;
}