
import api from './api'; // Importa a instância do Axios configurada

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
        // Faz a requisição POST para o endpoint /professores
        // O Axios adiciona automaticamente o prefixo /api (do api.ts)
        const response = await api.post('/professores', professorData);

        // O Axios retorna o corpo da resposta em 'response.data' em caso de sucesso (status 2xx)
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