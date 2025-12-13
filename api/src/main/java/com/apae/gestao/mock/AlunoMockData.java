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
                    new Aluno(null, "Ana Beatriz", LocalDate.of(2014, 3, 15), 10, "Autismo leve"),
                    new Aluno(null, "Carlos Eduardo", LocalDate.of(2013, 7, 22), 11, "Síndrome de Down"),
                    new Aluno(null, "João Pedro", LocalDate.of(2012, 1, 10), 12, "Deficiência visual"),
                    new Aluno(null, "Mariana Silva", LocalDate.of(2015, 9, 5), 9, "Autismo leve"),
                    new Aluno(null, "Pedro Lucas", LocalDate.of(2011, 11, 30), 13, "Deficiência auditiva"),
                    new Aluno(null, "Eduardo", LocalDate.of(2014, 5, 18), 10, "Autismo leve"),
                    new Aluno(null, "Pedro Silva", LocalDate.of(2013, 2, 14), 11, "Síndrome de Down"),
                    new Aluno(null, "Thiago da Silva", LocalDate.of(2012, 8, 25), 12, "Deficiência visual"),
                    new Aluno(null, "Marina Costa", LocalDate.of(2015, 4, 12), 9, "Autismo leve"),
                    new Aluno(null, "Pedro Neto", LocalDate.of(2011, 6, 8), 13, "Deficiência auditiva"),
                    new Aluno(null, "Ana Luiza", LocalDate.of(2014, 10, 20), 10, "Autismo leve"),
                    new Aluno(null, "João Gabriel", LocalDate.of(2013, 12, 3), 11, "Síndrome de Down"),
                    new Aluno(null, "João Lucas", LocalDate.of(2012, 3, 17), 12, "Deficiência visual"),
                    new Aluno(null, "Margarida Oliveira", LocalDate.of(2015, 7, 9), 9, "Autismo leve"),
                    new Aluno(null, "Larissa Pereira", LocalDate.of(2011, 9, 21), 13, "Deficiência auditiva"),
                    new Aluno(null, "Beatriz Costa", LocalDate.of(2014, 1, 28), 10, "Autismo leve"),
                    new Aluno(null, "Carlos Emanuel", LocalDate.of(2013, 6, 11), 11, "Síndrome de Down"),
                    new Aluno(null, "Peter Jordan", LocalDate.of(2012, 11, 4), 12, "Deficiência visual"),
                    new Aluno(null, "Eduarda Silva", LocalDate.of(2015, 2, 19), 9, "Autismo leve"),
                    new Aluno(null, "Pedro Almeida", LocalDate.of(2011, 4, 7), 13, "Deficiência auditiva")
            );

            alunoRepository.saveAll(alunos);
            System.out.println("✅ 20 alunos mockados inseridos no banco!");
        } else {
            System.out.println("ℹ️  Alunos já existentes — mock não inserido.");
        }
    }
}
