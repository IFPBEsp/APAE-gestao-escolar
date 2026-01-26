
import api from './api'; 

/**
 * Cadastra um novo professor na API.
 *
 * A chamada POST será direcionada para: [baseURL do api.ts] + '/professores'
 * O que resulta na URL lógica: /api/professores
 *
 * @param {object} professorData - Os dados do professor (nome, email, etc.)
 * @returns {Promise<object>} O objeto de resposta da API (ProfessorResponseDTO).
 * @throws {Error} Lança um erro se a requisição falhar (status 4xx ou 5xx).
 */
export async function registerProfessor(professorData) {
    
    try {
        const response = await api.post('/professores', professorData);

        return response.data;

    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro desconhecido ao tentar se conectar com a API.";
        
        console.error("ProfessorService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

/**
 * Busca professores com filtros opcionais.
 * 
 * @param {string} nome - Nome para busca (opcional)
 * @param {boolean} ativo - Status do professor (opcional)
 * @returns {Promise<Array>} Lista de professores
 */
export async function listarProfessores(nome, ativo) {
    try {
        const params = new URLSearchParams();
        if (nome) params.append('nome', nome);
        if (ativo !== undefined) params.append('ativo', ativo.toString());
        
        const response = await api.get(`/professores?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao listar professores:", error);
        throw new Error("Erro ao carregar professores");
    }
}

/**
 * Busca um professor por ID.
 * 
 * @param {number} id - ID do professor
 * @returns {Promise<object>} Dados do professor
 */
export async function buscarProfessorPorId(id) {
    try {
        const response = await api.get(`/professores/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar professor:", error);
        throw new Error("Erro ao carregar dados do professor");
    }
}

/**
 * Atualiza um professor existente.
 * 
 * @param {number} id - ID do professor
 * @param {object} professorData - Dados atualizados
 * @returns {Promise<object>} Professor atualizado
 */
export async function atualizarProfessor(id, professorData) {
    try {
        const response = await api.put(`/professores/${id}`, professorData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar professor:", error);
        throw new Error("Erro ao atualizar professor");
    }
}

export async function listarTurmasDeProfessor(id) {
    try {
        const response = await api.get(`/professores/${id}/turmas`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao buscar turmas do professor.";
        console.error("ProfessorService Error:", error.response || error);
        throw new Error(errorMessage);
    }
    
}