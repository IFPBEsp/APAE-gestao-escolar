import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean | string;
}

export const consultarCep = async (
  cep: string,
  signal?: AbortSignal
): Promise<ViaCepResponse> => {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos.');
  }

  const response = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${cepLimpo}/json/`,
    { signal }
  );

  if (response.data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return response.data;
};