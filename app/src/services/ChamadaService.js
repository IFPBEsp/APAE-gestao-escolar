import api from './api';

const MOCK_DB_KEY = 'attendance_mock_db';

function getMockDB() {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(MOCK_DB_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveToMockDB(records) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(records));
}

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

export async function getChamadaPorTurmaEData(turmaId, data) {
    try {
        const db = getMockDB();
        const localRecord = db.find(r => r.turmaId == turmaId && r.data === data);

        if (localRecord) {
            return {
                listaPresencas: localRecord.presencas.map(p => ({
                    alunoId: p.alunoId,
                    alunoNome: "Aluno",
                    status: p.status
                })),
                descricao: localRecord.descricao
            };
        }

        const response = await api.get(`/presencas/chamadas/turmas/${turmaId}`, {
            params: { data }
        });
        return response.data;
    } catch (error) {
        console.error("ChamadaService Error (getChamadaPorTurmaEData):", error);
        return { listaPresencas: [] };
    }
}

export async function registrarChamada(turmaId, data, chamadaRequest) {
    try {
        const db = getMockDB();
        const filteredDb = db.filter(r => !(r.turmaId == turmaId && r.data === data));

        const newRecord = {
            turmaId,
            data,
            descricao: chamadaRequest.descricao,
            presencas: chamadaRequest.presencas
        };

        saveToMockDB([...filteredDb, newRecord]);

        await api.post(
            `/presencas/chamadas/turmas/${turmaId}`,
            chamadaRequest,
            { params: { data } }
        ).catch(err => console.warn("Backend save failed, using local mock only.", err));

        return { success: true };
    } catch (error) {
        console.error("ChamadaService Error (registrarChamada):", error);
        throw new Error("Erro ao registrar a chamada.");
    }
}

export async function getHistoricoAluno(turmaId, alunoId) {
    const db = getMockDB();
    const studentHistory = db
        .filter(r => r.turmaId == turmaId && r.presencas.some(p => p.alunoId == alunoId))
        .map(r => {
            const presenca = r.presencas.find(p => p.alunoId == alunoId);
            return {
                data: r.data.split('-').reverse().join('/'),
                descricao: r.descricao,
                status: presenca?.status === 'PRESENTE' ? 'Presente' : 'Ausente'
            };
        })
        .sort((a, b) => new Date(b.data.split('/').reverse().join('-')).getTime() - new Date(a.data.split('/').reverse().join('-')).getTime());

    return studentHistory;
}

export async function getEstatisticasTurma(turmaId) {
    const db = getMockDB();
    const turmaRecords = db.filter(r => r.turmaId == turmaId);

    if (turmaRecords.length === 0) return [];

    const statsMap = {};

    turmaRecords.forEach(record => {
        record.presencas.forEach(p => {
            if (!statsMap[p.alunoId]) statsMap[p.alunoId] = { total: 0, present: 0 };
            statsMap[p.alunoId].total++;
            if (p.status === 'PRESENTE') statsMap[p.alunoId].present++;
        });
    });

    return Object.keys(statsMap).map(alunoId => {
        const { total, present } = statsMap[alunoId];
        const percent = total > 0 ? Math.round((present / total) * 100) : 0;
        return {
            alunoId: isNaN(alunoId) ? alunoId : Number(alunoId),
            frequencia: percent,
            totalAulas: total,
            totalPresencas: present
        };
    });
}

export async function contarAulasRealizadas(turmaId) {
    const db = getMockDB();
    const count = db.filter(r => r.turmaId == turmaId).length;
    return count;
}