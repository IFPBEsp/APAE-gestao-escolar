import api from './api';

/**
 * Busca os alunos de uma turma.
 *
 * GET -> /api/turmas/{turmaId}/alunos
 */
export async function getAlunosDaTurma(turmaId) {
    try {
        const response = await api.get(`/turmas/${turmaId}/alunos`);
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage =
            apiMessage ||
            error.message ||
            "Erro ao buscar alunos da turma.";
        
        console.error("ChamadaService Error (getAlunosDaTurma):", error.response || error);
        throw new Error(errorMessage);
    }
}

/**
 * Busca a chamada do dia para uma turma.
 *
 * GET -> /api/presencas/chamadas/turmas/{turmaId}?data=YYYY-MM-DD
 */
export async function getChamadaPorTurmaEData(turmaId, data) {
    try {
        const response = await api.get(`/presencas/chamadas/turmas/${turmaId}`, {
            params: { data }
        });
        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage =
            apiMessage ||
            error.message ||
            "Erro ao buscar chamada da turma.";
        
        console.error("ChamadaService Error (getChamadaPorTurmaEData):", error.response || error);
        throw new Error(errorMessage);
    }
}

/**
 * Envia a chamada do dia para o backend.
 *
 * POST -> /api/presencas/chamadas/turmas/{turmaId}?data=YYYY-MM-DD
 *
 * @param turmaId
 * @param data (YYYY-MM-DD)
 * @param chamadaRequest (objeto compatível com RegistrarChamadaRequestDTO)
 */
export async function registrarChamada(turmaId, data, chamadaRequest) {
    try {
        const response = await api.post(
            `/presencas/chamadas/turmas/${turmaId}`,
            chamadaRequest,
            { params: { data } }
        );

        return response.data;
    } catch (error) {
        const apiMessage = error.response?.data?.message;
        const errorMessage =
            apiMessage ||
            error.message ||
            "Erro ao registrar a chamada.";
        
        console.error("ChamadaService Error (registrarChamada):", error.response || error);
        throw new Error(errorMessage);
    }
}
