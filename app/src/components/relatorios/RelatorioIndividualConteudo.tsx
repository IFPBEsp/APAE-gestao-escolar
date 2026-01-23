interface Props {
  atividades: string;
  habilidades: string;
  estrategias: string;
  recursos: string;
}

export function RelatorioIndividualConteudo({
  atividades,
  habilidades,
  estrategias,
  recursos,
}: Props) {
  return (
    <>
      <section className="impressao-secao">
        <h3 className="impressao-secao-titulo">ATIVIDADES</h3>
        <div className="impressao-secao-conteudo">
          {atividades || "Não informado"}
        </div>
      </section>

      <section className="impressao-secao">
        <h3 className="impressao-secao-titulo">HABILIDADES</h3>
        <div className="impressao-secao-conteudo">
          {habilidades || "Não informado"}
        </div>
      </section>

      <section className="impressao-secao">
        <h3 className="impressao-secao-titulo">ESTRATÉGIAS</h3>
        <div className="impressao-secao-conteudo">
          {estrategias || "Não informado"}
        </div>
      </section>

      <section className="impressao-secao">
        <h3 className="impressao-secao-titulo">RECURSOS</h3>
        <div className="impressao-secao-conteudo">
          {recursos || "Não informado"}
        </div>
      </section>
    </>
  );
}
