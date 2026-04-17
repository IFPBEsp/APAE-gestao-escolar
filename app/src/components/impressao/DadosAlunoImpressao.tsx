import { format } from "date-fns";

interface DadosAlunoImpressaoProps {
  cidade: string;
  dataRelatorio: string;
  nome: string;
  nascimento: string;
  turma: string;
}

export default function DadosAlunoImpressao({
  cidade,
  dataRelatorio,
  nome,
  nascimento,
  turma,
}: DadosAlunoImpressaoProps) {

  const formatarNascimento = (data: string) => {
    if (!data || data === "—") return "—";
    if (data.includes("/")) return data;

    try {
      const date = new Date(data);
      if (!isNaN(date.getTime())) {
        return format(date, "dd/MM/yyyy");
      }
    } catch (e) {}

    return data;
  };

  return (
    <section className="impressao-dados">
      <p>
        <strong>{cidade}</strong>, {dataRelatorio}
      </p>

      <p>
        <strong>NOME DO ALUNO:</strong> {nome}
      </p>

      <p>
        <strong>DATA DE NASCIMENTO:</strong> {formatarNascimento(nascimento)}
      </p>

      <p>
        <strong>TURMA:</strong> {turma}
      </p>
    </section>
  );
}
