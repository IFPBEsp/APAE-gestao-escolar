interface Props {
  titulo: string;
}

export default function CabecalhoInstitucional({ titulo }: Props) {
  return (
    <div className="impressao-cabecalho">
      <h1>ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS</h1>
      <p>CNPJ: 01.180.414/0001-02</p>
      <p>ENDEREÇO: SANTO ANTÔNIO, 491</p>
      <p>CEP: 58.135-000 / ESPERANÇA - PB</p>
      <p>RECONHECIDA DE UTILIDADE PÚBLICA</p>

      <div className="impressao-titulo-documento">
        {titulo}
      </div>
    </div>
  );
}
