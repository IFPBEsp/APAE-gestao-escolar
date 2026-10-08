import api from './api';

export async function getResumoTurma(turmaId) {
    try {
        const response = await api.get(`/frequencia/turma/${turmaId}/resumo`);
        return response.data;
    } catch (error) {
        console.error("FrequenciaService Error (getResumoTurma):", error);
        throw new Error("Erro ao buscar resumo da turma.");
    }
}

export async function getAlunosComFrequencia(turmaId, page = 0, size = 100) {
    try {
        const response = await api.get(`/frequencia/turma/${turmaId}/alunos`, {
            params: { page, size, sort: 'nomeCompleto,asc' }
        });
        
        const alunos = response.data.content || response.data || [];
        
        return alunos.map(aluno => {
            const id = aluno.pacienteId || aluno.alunoId || aluno.id;
            return {
                id,
                alunoId: id,
                pacienteId: id,
                nome: aluno.nome,
                matricula: aluno.matricula,
                percentualFrequencia: aluno.percentualFrequencia || aluno.frequencia || 0,
                totalAulas: aluno.totalAulas || 0,
                totalPresencas: aluno.totalPresencas || 0
            };
        });
    } catch (error) {
        console.error("FrequenciaService Error (getAlunosComFrequencia):", error);
        throw new Error("Erro ao buscar alunos com frequência.");
    }
}

export async function getHistoricoIndividualAluno(alunoId, page = 0, size = 100) {
    try {
        const response = await api.get(`/frequencia/aluno/${alunoId}/historico`, {
            params: { page, size }
        });
        
        const historico = response.data.content || response.data || [];
        
        return historico.map(item => ({
            descricao: item.descricaoAula || item.descricao || '',
            status: item.statusPresenca === true ? 'Presente' : 'Ausente'
        }));
    } catch (error) {
        console.error("FrequenciaService Error (getHistoricoIndividualAluno):", error);
        throw new Error("Erro ao buscar histórico do aluno.");
    }
}
