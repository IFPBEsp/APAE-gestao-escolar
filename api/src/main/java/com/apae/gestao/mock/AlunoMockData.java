package com.apae.gestao.mock;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AlunoMockData implements CommandLineRunner {

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void run(String... args) {
        if (alunoRepository.count() == 0) {
            List<Aluno> alunos = List.of(
                    new Aluno(null, "Ana Beatriz", 10, "Autismo leve"),
                    new Aluno(null, "Carlos Eduardo", 11, "Síndrome de Down"),
                    new Aluno(null, "João Pedro", 12, "Deficiência visual"),
                    new Aluno(null, "Mariana Silva", 9, "Autismo leve"),
                    new Aluno(null, "Pedro Lucas", 13, "Deficiência auditiva"),
                    new Aluno(null, "Eduardo", 10, "Autismo leve"),
                    new Aluno(null, "Pedro Silva", 11, "Síndrome de Down"),
                    new Aluno(null, "Thiago da Silva", 12, "Deficiência visual"),
                    new Aluno(null, "Marina Costa", 9, "Autismo leve"),
                    new Aluno(null, "Pedro Neto", 13, "Deficiência auditiva"),
                    new Aluno(null, "Ana Luiza", 10, "Autismo leve"),
                    new Aluno(null, "João Gabriel", 11, "Síndrome de Down"),
                    new Aluno(null, "João Lucas", 12, "Deficiência visual"),
                    new Aluno(null, "Margarida Oliveira", 9, "Autismo leve"),
                    new Aluno(null, "Larissa Pereira", 13, "Deficiência auditiva"),
                    new Aluno(null, "Beatriz Costa", 10, "Autismo leve"),
                    new Aluno(null, "Carlos Emanuel", 11, "Síndrome de Down"),
                    new Aluno(null, "Peter Jordan", 12, "Deficiência visual"),
                    new Aluno(null, "Eduarda Silva", 9, "Autismo leve"),
                    new Aluno(null, "Pedro Almeida", 13, "Deficiência auditiva")
            );

            alunoRepository.saveAll(alunos);
            System.out.println("✅ 20 alunos mockados inseridos no banco!");
        } else {
            System.out.println("ℹ️  Alunos já existentes — mock não inserido.");
        }
    }
}
