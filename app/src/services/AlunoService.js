import api from './api'; 

export const listarAlunos = async (nome = '') => {
    try {
        const response = await api.get('/alunos', {
            params: nome.trim() ? { nome: nome.trim() } : {}
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        throw error;
    }
};

export const buscarAlunoPorId = async (id) => {
    try {
        const response = await api.get(`/alunos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar aluno ${id}:`, error);
        throw error;
    }
};

export const atualizarTurmaAluno = async (alunoId, novaTurmaId) => {
    try {
        const dto = { novaTurmaId };
        const response = await api.patch(`/alunos/${alunoId}/turma`, dto);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar turma do aluno ${alunoId}:`, error);
        throw error;
    }
};

export const buscarAvaliacoesPorAlunoId = async (id) => {
    try {
        const response = await api.get(`/alunos/${id}/avaliacoes`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar avaliações do aluno ${id}:`, error);
        throw error;
    }
};

export const buscarHistoricoTurmasPorAlunoId = async (id) => {
    try {
        const response = await api.get(`/alunos/${id}/turmas/historico`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar histórico de turmas do aluno ${id}:`, error);
        throw error;
    }
};
