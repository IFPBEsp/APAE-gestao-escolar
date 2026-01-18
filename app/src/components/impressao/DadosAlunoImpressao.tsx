interface DadosAlunoImpressaoProps {
  cidade: string;
  dataRelatorio: string;
  nome: string;
  nascimento: string;
  turma: string;
  ano: string;
}

export default function DadosAlunoImpressao({
  cidade,
  dataRelatorio,
  nome,
  nascimento,
  turma,
  ano,
}: DadosAlunoImpressaoProps) {
  return (
    <section className="impressao-dados">
      <p>
        <strong>{cidade}</strong>, {dataRelatorio}
      </p>

      <p>
        <strong>NOME DO ALUNO:</strong> {nome}
      </p>

      <p>
        <strong>DATA DE NASCIMENTO:</strong> {nascimento}
      </p>

      <p>
        <strong>TURMA:</strong> {turma}
        <span style={{ marginLeft: "80px" }}>
          <strong>ANO:</strong> {ano}
        </span>
      </p>
    </section>
  );
}
