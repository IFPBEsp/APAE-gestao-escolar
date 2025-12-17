import api from './api';

export async function listarTurmas() {
    try {
        const response = await api.get('/turmas');
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function buscarTurmaPorId(id) {
    try {
        const response = await api.get(`/turmas/${id}`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function criarTurma(turmaData) { 
    try {
        const response = await api.post('/turmas', turmaData);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function atualizarTurma(id, turmaData) {
    try {
        const response = await api.put(`/turmas/${id}`, turmaData);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function ativarTurma(id){
    try {
        await api.patch(`/turmas/${id}/ativar`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function desativarTurma(id){
    try {
        await api.patch(`/turmas/${id}/desativar`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function excluirTurma(id){
    try {
        await api.delete(`/turmas/${id}`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function atribuirProfessor(professorId, turmaId){
    try {
        await api.post(`/turmas/${turmaId}/professor/${professorId}`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function adicionarAlunosATurma(turmaId, alunosIds){
    try {
        await api.post(`/turmas/${turmaId}/alunos`,  alunosIds );
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function listarAlunos(turmaId){
    try {
        const response = await api.get(`/turmas/${turmaId}/alunos`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function listarAlunosAtivos(turmaId){
    try {
        const response = await api.get(`/turmas/${turmaId}/alunos/ativos`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function listarAlunosInativos(turmaId){
    try {
        const response = await api.get(`/turmas/${turmaId}/alunos/inativos`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function ativarAlunoDaTurma(turmaId, alunoId){
    try {
        await api.patch(`/turmas/${turmaId}/alunos/${alunoId}/ativar`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}

export async function desativarAlunoDaTurma(turmaId, alunoId){
    try {
        await api.patch(`/turmas/${turmaId}/alunos/${alunoId}/desativar`);
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage = apiMessage
                                || error.message
                                || "Erro desconhecido ao tentar se conectar com a API.";
        console.error("TurmaService Error:", error.response || error);
        throw new Error(errorMessage);
    }
}