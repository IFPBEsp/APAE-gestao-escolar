import axios from "axios";

export function apiError(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) return error;
  return error instanceof Error ? error : new Error("Erro inesperado");
}

export function errorResponse(error: unknown) {
  return axios.isAxiosError<{ message?: string }>(error) ? error.response : undefined;
}
