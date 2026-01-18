interface Assinatura {
  nome: string;
  cargo: string;
}

interface AssinaturasProps {
  esquerda: Assinatura;
  direita: Assinatura;
}

export default function Assinaturas({
  esquerda,
  direita,
}: AssinaturasProps) {
  return (
    <section className="impressao-assinaturas">
      <div className="impressao-assinatura">
        <div className="impressao-assinatura-linha">
          <p className="impressao-assinatura-nome">{esquerda.nome}</p>
          <p className="impressao-assinatura-cargo">{esquerda.cargo}</p>
        </div>
      </div>

      <div className="impressao-assinatura">
        <div className="impressao-assinatura-linha">
          <p className="impressao-assinatura-nome">{direita.nome}</p>
          <p className="impressao-assinatura-cargo">{direita.cargo}</p>
        </div>
      </div>
    </section>
  );
}
