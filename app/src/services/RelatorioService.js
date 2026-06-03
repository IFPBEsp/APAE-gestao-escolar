import api from './api';

export async function criarRelatorio(data) {
  try{
    const response = await api.post('/relatorios', data);
    return response.data;
  } catch (error) {
    const apiMessage = error.response?.data?.message;
    const errorMessage = apiMessage
                || error.message 
                || "Erro ao buscar Relatorio do aluno.";
    console.error("RelatorioService Error:", error.response || error);
    throw new Error(errorMessage);
  }
}

export async function atualizarRelatorio(id, relatorioData) {
  try{
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

export async function buscarRelatorioPorAluno(alunoId) {
  try{
    const response = await api.get(`/relatorios/alunos/${alunoId}`);
    return response.data;
  } catch (error) {
    const apiMessage = error.response?.data?.message;
    const errorMessage = apiMessage
                || error.message 
                || "Erro ao buscar Relatorio do aluno.";
    console.error("RelatorioService Error:", error.response || error);
    throw new Error(errorMessage);
  }
}

export async function listarRelatorios() {
  try{
    const response = await api.get('/relatorios');
    return response.data;
  } catch (error) {
    const apiMessage = error.response?.data?.message;
    const errorMessage = apiMessage
                || error.message 
                || "Erro ao listar Relatorios.";
    console.error("RelatorioService Error:", error.response || error);
    throw new Error(errorMessage);
  }
}

export async function deletarRelatorio(id) {
  try{
    await api.delete(`/relatorios/${id}`);
  } catch (error) {
    const apiMessage = error.response?.data?.message;
    const errorMessage = apiMessage
                || error.message 
                || "Erro ao deletar Relatorio do aluno.";
    console.error("RelatorioService Error:", error.response || error);
    throw new Error(errorMessage);
  }
}
