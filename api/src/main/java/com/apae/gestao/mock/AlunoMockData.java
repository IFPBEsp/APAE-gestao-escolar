package com.apae.gestao.mock;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AlunoMockData implements CommandLineRunner {

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void run(String... args) {
        if (alunoRepository.count() == 0) {
            List<Aluno> alunos = List.of(
                new Aluno(
                    null, "Ana Beatriz Costa", "Transtorno do Espectro Autista (TEA) leve", 
                    LocalDate.of(2014, 5, 10), "(11) 98765-1111", "Cláudia Souza"
                ),
                new Aluno(
                    null, "Carlos Eduardo Silva", "Síndrome de Down", 
                    LocalDate.of(2013, 8, 25), "(11) 99876-2222", "Fernando Lima"
                ),
                new Aluno(
                    null, "João Pedro Oliveira", "Deficiência Visual Total", 
                    LocalDate.of(2015, 3, 1), "(21) 97654-3333", "Patrícia Ribeiro"
                ),
                new Aluno(
                    null, "Mariana Silva Santos", "Transtorno do Espectro Autista (TEA) leve", 
                    LocalDate.of(2016, 11, 19), "(21) 96543-4444", "Roberto Santos"
                ),
                new Aluno(
                    null, "Pedro Lucas Mendes", "Deficiência Auditiva Bilateral", 
                    LocalDate.of(2017, 7, 30), "(31) 95432-5555", "Luciana Mendes"
                ),
                new Aluno(
                    null, "Eduardo Gomes Ferreira", "TDAH e Dislexia", 
                    LocalDate.of(2012, 1, 14), "(31) 94321-6666", "Gustavo Ferreira"
                ),
                new Aluno(
                    null, "Pedro Silva Neto", "Síndrome de Down", 
                    LocalDate.of(2014, 4, 5), "(41) 93210-7777", "Adriana Neto"
                ),
                new Aluno(
                    null, "Thiago da Silva Martins", "Deficiência Visual Parcial", 
                    LocalDate.of(2015, 9, 22), "(41) 92109-8888", "José Martins"
                ),
                new Aluno(
                    null, "Marina Costa Ribeiro", "Transtorno do Espectro Autista (TEA) nível 1", 
                    LocalDate.of(2013, 2, 7), "(51) 91098-9999", "Sofia Ribeiro"
                ),
                new Aluno(
                    null, "Pedro Neto Almeida", "Deficiência Auditiva Parcial", 
                    LocalDate.of(2016, 12, 3), "(51) 90987-0000", "Ricardo Almeida"
                ),
                new Aluno(
                    null, "Ana Luiza Nogueira", "Deficiência Intelectual Leve", 
                    LocalDate.of(2014, 6, 18), "(61) 99876-1234", "Helena Nogueira"
                ),
                new Aluno(
                    null, "João Gabriel Melo", "Síndrome de Down", 
                    LocalDate.of(2017, 10, 28), "(61) 98765-2345", "Paulo Melo"
                ),
                new Aluno(
                    null, "João Lucas Pires", "Deficiência Visual Total", 
                    LocalDate.of(2012, 3, 9), "(71) 97654-3456", "Camila Pires"
                ),
                new Aluno(
                    null, "Margarida Oliveira Vaz", "Transtorno do Espectro Autista (TEA) nível 2", 
                    LocalDate.of(2018, 1, 6), "(71) 96543-4567", "Antônio Vaz"
                ),
                new Aluno(
                    null, "Larissa Pereira Rocha", "Deficiência Auditiva Bilateral", 
                    LocalDate.of(2015, 11, 12), "(81) 95432-5678", "Viviane Rocha"
                ),
                new Aluno(
                    null, "Beatriz Costa Freire", "Paralisia Cerebral", 
                    LocalDate.of(2013, 5, 29), "(81) 94321-6789", "Marcelo Freire"
                ),
                new Aluno(
                    null, "Carlos Emanuel Lima", "Síndrome de Down", 
                    LocalDate.of(2016, 9, 2), "(91) 93210-7890", "Regina Lima"
                ),
                new Aluno(
                    null, "Peter Jordan Nolasco", "Deficiência Visual Parcial", 
                    LocalDate.of(2014, 8, 20), "(91) 92109-8901", "Fábio Nolasco"
                ),
                new Aluno(
                    null, "Eduarda Silva Almeida", "Deficiência Intelectual Moderada", 
                    LocalDate.of(2017, 1, 1), "(11) 91098-9012", "Sandra Almeida"
                ),
                new Aluno(
                    null, "Pedro Almeida Cruz", "Deficiência Auditiva Parcial", 
                    LocalDate.of(2012, 10, 17), "(11) 90987-0123", "Thiago Cruz"
                )
            );

            alunoRepository.saveAll(alunos);
            System.out.println("✅ 20 alunos mockados inseridos no banco!");
        } else {
            System.out.println("ℹ️ Alunos já existentes — mock não inserido.");
        }
    }
}
