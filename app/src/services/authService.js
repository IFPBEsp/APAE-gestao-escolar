import api from "./api";

export const login = async (email, senha) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      senha,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const primeiroAcesso = async (email, novaSenha) => {
  try {
    const response = await api.post("/auth/primeiro-acesso", {
      email,
      novaSenha,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
