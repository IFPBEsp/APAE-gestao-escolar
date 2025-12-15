package com.apae.gestao.mock;

import com.apae.gestao.entity.Professor;
import com.apae.gestao.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(
    name = "app.mock.professores.enabled", 
    havingValue = "true", 
    matchIfMissing = false
)
public class ProfessorMockData implements CommandLineRunner {

    @Autowired
    private ProfessorRepository professorRepository;

    @Override
    public void run(String... args) {
        List<Professor> professoresMock = List.of(
                // Professores ATIVOS
                criarProfessor("Maria Silva", "12345678901", "maria.silva@apae.org.br", 
                        "(11) 99999-1111", LocalDate.of(1985, 5, 15), 
                        "Educação Especial", LocalDate.of(2020, 1, 10), 
                        "Rua das Flores, 100 - Centro", true),
                
                criarProfessor("João Santos", "23456789012", "joao.santos@apae.org.br", 
                        "(11) 99999-2222", LocalDate.of(1988, 8, 20), 
                        "Matemática", LocalDate.of(2019, 3, 15), 
                        "Av. Principal, 200 - Bairro Novo", true),
                
                criarProfessor("Ana Costa", "34567890123", "ana.costa@apae.org.br", 
                        "(11) 99999-3333", LocalDate.of(1990, 2, 10), 
                        "Língua Portuguesa", LocalDate.of(2021, 6, 1), 
                        "Rua do Comércio, 300 - Centro", true),
                
                criarProfessor("Carlos Lima", "45678901234", "carlos.lima@apae.org.br", 
                        "(11) 99999-4444", LocalDate.of(1987, 11, 25), 
                        "Educação Física", LocalDate.of(2020, 2, 20), 
                        "Av. Esportiva, 400 - Vila Esportiva", true),
                
                criarProfessor("Paula Oliveira", "56789012345", "paula.oliveira@apae.org.br", 
                        "(11) 99999-5555", LocalDate.of(1992, 4, 5), 
                        "Artes", LocalDate.of(2022, 1, 5), 
                        "Rua dos Artistas, 500 - Centro Cultural", true),
                
                criarProfessor("Roberto Mendes", "67890123456", "roberto.mendes@apae.org.br", 
                        "(11) 99999-6666", LocalDate.of(1986, 7, 12), 
                        "Ciências", LocalDate.of(2018, 8, 10), 
                        "Av. Científica, 600 - Parque Tecnológico", true),
                
                criarProfessor("Fernanda Alves", "78901234567", "fernanda.alves@apae.org.br", 
                        "(11) 99999-7777", LocalDate.of(1989, 9, 30), 
                        "Educação Especial", LocalDate.of(2021, 3, 15), 
                        "Rua da Educação, 700 - Bairro Educacional", true),
                
                // Professores INATIVOS (para testar filtro)
                criarProfessor("Pedro Souza", "89012345678", "pedro.souza@apae.org.br", 
                        "(11) 99999-8888", LocalDate.of(1984, 1, 20), 
                        "História", LocalDate.of(2017, 5, 1), 
                        "Av. Histórica, 800 - Centro Histórico", false),
                
                criarProfessor("Juliana Rocha", "90123456789", "juliana.rocha@apae.org.br", 
                        "(11) 99999-9999", LocalDate.of(1991, 6, 15), 
                        "Geografia", LocalDate.of(2019, 9, 1), 
                        "Rua Geográfica, 900 - Bairro Geográfico", false),
                
                criarProfessor("Ricardo Pereira", "01234567890", "ricardo.pereira@apae.org.br", 
                        "(11) 99999-0000", LocalDate.of(1983, 12, 8), 
                        "Física", LocalDate.of(2016, 2, 10), 
                        "Av. Física, 1000 - Parque Científico", false)
        );

        // Insere apenas professores que não existem (verifica por CPF)
        int inseridos = 0;
        for (Professor professor : professoresMock) {
            if (!professorRepository.existsByCpf(professor.getCpf())) {
                professorRepository.save(professor);
                inseridos++;
            }
        }

        if (inseridos > 0) {
            System.out.println("✅ " + inseridos + " professores mockados inseridos no banco!");
        } else {
            System.out.println("ℹ️  Todos os professores mockados já existem no banco.");
        }
    }

    private Professor criarProfessor(String nome, String cpf, String email, String telefone,
                                     LocalDate dataNascimento, String formacao,
                                     LocalDate dataContratacao, String endereco, boolean ativo) {
        Professor professor = new Professor();
        professor.setNome(nome);
        professor.setCpf(cpf);
        professor.setEmail(email);
        professor.setTelefone(telefone);
        professor.setDataNascimento(dataNascimento);
        professor.setFormacao(formacao);
        professor.setDataContratacao(dataContratacao);
        professor.setEndereco(endereco);
        professor.setAtivo(ativo);
        return professor;
    }
}

