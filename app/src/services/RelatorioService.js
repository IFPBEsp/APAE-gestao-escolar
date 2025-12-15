import api from './api';

export async function criarRelatorio(relatorioData) {
    try {
        const response = await api.post('/relatorios', relatorioData);
        return response.data;
    }       catch (error){
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao criar relatório.";
        console.error("RelatorioService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function buscarRelatorioPorId(id) {
    try {
        const response = await api.get(`/relatorios/${id}`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao buscar relatório por ID.";
        console.error("RelatorioService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function atualizarRelatorio(id, relatorioData) {
    try {
        const response = await api.put(`/relatorios/${id}`, relatorioData);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao atualizar relatório.";
        console.error("RelatorioService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function deletarRelatorio(id) {
    try {
        await api.delete(`/relatorios/${id}`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao deletar relatório.";
        console.error("RelatorioService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function listarRelatorios() {
    try {
        const response = await api.get('/relatorios');
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage 
                             || error.message 
                             || "Erro ao listar relatórios.";
        console.error("RelatorioService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}