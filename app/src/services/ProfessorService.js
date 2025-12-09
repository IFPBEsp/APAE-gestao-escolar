
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