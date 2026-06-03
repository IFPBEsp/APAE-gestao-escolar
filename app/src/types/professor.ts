export interface Professor {
  id: string;
  usuarioId?: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  formacao?: string;
  dataContratacao: string;
  endereco?: string;
  ativo: boolean;
  primeiroAcesso?: boolean;
}

export interface ProfessorResumo {
  id: string;
  usuarioId?: string;
  nome: string;
  cpf: string;
  email: string;
  ativo: boolean;
  telefone?: string;
  formacao?: string;
  dataContratacao?: string;
  dataNascimento?: string;
  endereco?: string;
  primeiroAcesso?: boolean;
}
