import api from './api'; 

/**
 * Busca a lista de alunos, opcionalmente filtrada por nome.
 * @param {string} [nome] O nome ou parte do nome para filtrar.
 * @returns {Promise<Array<object>>} Uma lista de AlunoResponseDTOs.
 */
export const listarAlunos = async (nome = '') => {
    try {
        const response = await api.get('/alunos', {
            params: { nome: nome }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        throw error;
    }
};

/**
 * Busca os detalhes de um aluno por ID.
 * @param {number} id O ID do aluno.
 * @returns {Promise<object>} O AlunoResponseDTO.
 */
export const buscarAlunoPorId = async (id) => {
    try {
        const response = await api.get(`/alunos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar aluno ${id}:`, error);
        throw error;
    }
};

/**
 * Atualiza a turma atual de um aluno específico usando o endpoint PATCH.
 * @param {number} alunoId O ID do aluno.
 * @param {number} novaTurmaId O ID da nova turma.
 * @returns {Promise<object>} O AlunoResponseDTO atualizado.
 */
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

/**
 * Busca o histórico de avaliações de um aluno.
 * @param {number} id O ID do aluno.
 * @returns {Promise<Array<object>>} Uma lista de AvaliacaoHistoricoResponseDTOs.
 */
export const buscarAvaliacoesPorAlunoId = async (id) => {
    try {
        const response = await api.get(`/alunos/${id}/avaliacoes`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar avaliações do aluno ${id}:`, error);
        throw error;
    }
};