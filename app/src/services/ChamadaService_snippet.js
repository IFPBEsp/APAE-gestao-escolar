
/**
 * Conta o número de aulas (chamadas) registradas para a turma.
 */
export async function contarAulasRealizadas(turmaId) {
    const db = getMockDB();
    const count = db.filter(r => r.turmaId == turmaId).length;
    return count;
}
