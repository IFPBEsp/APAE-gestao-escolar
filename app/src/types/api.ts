export interface HistoricoPresenca {
  data?: string;
  descricao: string;
  status: string;
}

export interface AlunoResumo {
  id: string;
  nome: string;
  nomeCompleto?: string;
  name?: string;
  pacienteId?: string;
  alunoId?: string;
  matricula?: string;
  ativo?: boolean;
  dataNascimento?: string;
  deficiencia?: string;
  nomeResponsavel?: string;
  nomeTurma?: string;
  turnoTurma?: string;
  nomeTurmaAtual?: string;
  turnoTurmaAtual?: string;
  turma?: { nome: string; turno?: string };
  dataUltimaAvaliacao?: string;
  ultimaAvaliacao?: string;
  frequencia?: number;
  percentualFrequencia?: number;
  totalAulas?: number;
  totalPresencas?: number;
  isMetricsLoading?: boolean;
  freqHistorico?: HistoricoPresenca[];
  frequenciaVal?: number | null;
}

export interface TurmaDetalhe {
  id: string;
  nome: string;
  tipo: string;
  turno: string;
  horario?: string;
  anoCriacao: number;
  ano?: number;
  ativa: boolean;
  descricao?: string;
  professor?: { id: string; nome: string } | null;
  alunos: { pacienteId: string; nome: string; ativo?: boolean; id?: string; alunoId?: string }[];
  totalAlunos?: number;
  totalAlunosAtivos?: number;
  capacidade?: number;
  ocupacao?: number;
}

export interface EstatisticaFrequencia {
  alunoId: string;
  frequencia: number;
  totalAulas: number;
  totalPresencas: number;
}

export interface AvaliacaoData {
  id?: string;
  data?: string;
  dataAvaliacao?: string;
  ultimaAvaliacao?: string;
  aluno?: string;
  professor?: string;
  professorNome?: string;
  turma?: string;
  turmaNomeCompleto?: string;
  descricao?: string;
  desenvolvimentoCognitivo?: string;
  desenvolvimentoMotor?: string;
  desenvolvimentoSocial?: string;
  autonomia?: string;
  habilidades?: string;
  observacoes?: string;
}

export interface RelatorioData {
  id?: string;
  alunoId?: string;
  data?: string | Date;
  createdAt?: string;
  aluno?: string;
  aluno_nascimento?: string;
  professor?: string;
  professorNome?: string;
  turma?: string;
  turmaNome?: string;
  atividades?: string;
  atividade?: string;
  habilidades?: string;
  estrategias?: string;
  recursos?: string;
}

export interface ChamadaData {
  descricao?: string;
  listaPresencas: { alunoId: string; alunoNome: string; status: string }[];
}
