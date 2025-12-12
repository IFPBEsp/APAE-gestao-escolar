import api from './api';

export async function listarAvaliacoesPorAluno(alunoId) {
    try {
        const response = await api.get(`/avaliacoes/alunos/${alunoId}`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao buscar avaliações do aluno.";
        console.error("AvaliacaoService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function criarAvaliacao(avaliacaoData) {
    try {
        const response = await api.post('/avaliacoes', avaliacaoData);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao criar avaliação.";
        console.error("AvaliacaoService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function atualizarAvaliacao(id, avaliacaoData) {
    try {
        const response = await api.put(`/avaliacoes/${id}`, avaliacaoData);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao atualizar avaliação.";
        console.error("AvaliacaoService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function deletarAvaliacao(id) {
    try {
        await api.delete(`/avaliacoes/${id}`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao deletar avaliação.";
        console.error("AvaliacaoService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}