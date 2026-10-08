export interface Endereco {
  cidade: string;
  cep: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string | null;
}

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
  endereco?: Endereco | null;
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
  endereco?: Endereco | null;
  primeiroAcesso?: boolean;
}
