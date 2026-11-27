package com.apae.gestao.security.integration;

import com.apae.gestao.security.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import java.util.UUID;

/**
 * Base para testes de integração de segurança.
 * Usa a configuração real da aplicação (filtros habilitados, sem mocks de
 * autorização, repositórios ou filtros) e um PostgreSQL isolado via Testcontainers.
 */
@SpringBootTest
@AutoConfigureMockMvc
public abstract class AbstractSecurityIntegrationTest {

    // ---- Identificadores fixos do cenário ----
    protected static final String ADMIN_EMAIL = "admin@teste.local";
    protected static final String PROFESSOR_A_EMAIL = "professor.a@teste.local";
    protected static final String PROFESSOR_B_EMAIL = "professor.b@teste.local";
    protected static final String SENHA_PADRAO = "Senha@123";

    protected static final UUID USUARIO_PROFESSOR_A_ID = UUID.fromString("a1000000-0000-4000-8000-000000000001");
    protected static final UUID USUARIO_PROFESSOR_B_ID = UUID.fromString("a1000000-0000-4000-8000-000000000002");
    protected static final UUID PROFESSOR_A_ID = UUID.fromString("a2000000-0000-4000-8000-000000000001");
    protected static final UUID PROFESSOR_B_ID = UUID.fromString("a2000000-0000-4000-8000-000000000002");
    protected static final UUID TURMA_A_ID = UUID.fromString("a3000000-0000-4000-8000-000000000001");
    protected static final UUID TURMA_B_ID = UUID.fromString("a3000000-0000-4000-8000-000000000002");
    protected static final UUID ALUNO_A1_ID = UUID.fromString("a4000000-0000-4000-8000-000000000001");
    protected static final UUID ALUNO_A2_ID = UUID.fromString("a4000000-0000-4000-8000-000000000002");
    protected static final UUID ALUNO_B1_ID = UUID.fromString("a4000000-0000-4000-8000-000000000003");
    protected static final UUID ALUNO_B2_ID = UUID.fromString("a4000000-0000-4000-8000-000000000004");

    // ---- Configuração de teste ----
    private static final String JWT_SECRET = "segredo-de-teste-com-mais-de-32-bytes-0123456789";
    private static final String OUTRO_SEGREDO = "outro-segredo-de-teste-diferente-0123456789-abcdef";
    private static final String ADMIN_PASS = "admin-senha-teste";

    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:15"));

    static {
        POSTGRES.start();
        aplicarContratoApaeGeral();
    }

    @DynamicPropertySource
    static void configurarPropriedades(DynamicPropertyRegistry registry) {
        registry.add("DATASOURCE_URL", POSTGRES::getJdbcUrl);
        registry.add("DATASOURCE_USERNAME", POSTGRES::getUsername);
        registry.add("DATASOURCE_PASSWORD", POSTGRES::getPassword);
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);

        registry.add("JWT_SECRET", () -> JWT_SECRET);
        registry.add("JWT_EXPIRATION", () -> "3600000");
        registry.add("ADMIN_EMAIL", () -> ADMIN_EMAIL);
        registry.add("ADMIN_PASS", () -> ADMIN_PASS);

        registry.add("MINIO_URL", () -> "http://localhost:9");
        registry.add("MINIO_ACCESS_KEY", () -> "teste");
        registry.add("MINIO_SECRET_KEY", () -> "teste-teste");
        registry.add("MINIO_BUCKET", () -> "teste");

        registry.add("spring.jpa.show-sql", () -> "false");
    }

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---- Preparação / isolamento ----
    @BeforeEach
    protected void prepararCenario() {
        limparBanco();

        String senha = passwordEncoder.encode(SENHA_PADRAO);

        criarProfessor(USUARIO_PROFESSOR_A_ID, PROFESSOR_A_ID, PROFESSOR_A_EMAIL,
                "Professor A", "000.000.001-01", senha);
        criarProfessor(USUARIO_PROFESSOR_B_ID, PROFESSOR_B_ID, PROFESSOR_B_EMAIL,
                "Professor B", "000.000.002-02", senha);

        criarTurma(TURMA_A_ID, "Turma A", PROFESSOR_A_ID);
        criarTurma(TURMA_B_ID, "Turma B", PROFESSOR_B_ID);

        criarAluno(ALUNO_A1_ID, "Aluno A1", "000.000.101-01", TURMA_A_ID);
        criarAluno(ALUNO_A2_ID, "Aluno A2", "000.000.102-02", TURMA_A_ID);
        criarAluno(ALUNO_B1_ID, "Aluno B1", "000.000.201-01", TURMA_B_ID);
        criarAluno(ALUNO_B2_ID, "Aluno B2", "000.000.202-02", TURMA_B_ID);
    }

    private void limparBanco() {
        jdbcTemplate.execute("TRUNCATE TABLE "
                + "gestao_escolar.presencas, gestao_escolar.avaliacoes, gestao_escolar.relatorios, "
                + "gestao_escolar.aulas, gestao_escolar.turma_aluno, gestao_escolar.turmas, "
                + "gestao_escolar.professores, apae_geral.responsaveis, apae_geral.pacientes, "
                + "apae_geral.usuarios, apae_geral.enderecos CASCADE");
    }

    private void criarProfessor(UUID usuarioId, UUID professorId, String email, String nome,
                                String cpf, String senha) {
        jdbcTemplate.update("INSERT INTO apae_geral.usuarios "
                + "(id, email, cpf, senha, nome_completo, cargo, contato, primeiro_acesso, ativo) "
                + "VALUES (?, ?, ?, ?, ?, 'GESTAO_ESCOLAR', '(83) 90000-0000', FALSE, TRUE)",
                usuarioId, email, cpf, senha, nome);
        jdbcTemplate.update("INSERT INTO gestao_escolar.professores "
                + "(id, usuario_id, formacao, data_contratacao, primeiro_acesso, data_nascimento) "
                + "VALUES (?, ?, 'Pedagogia', CURRENT_DATE, FALSE, DATE '1990-01-01')",
                professorId, usuarioId);
    }

    private void criarTurma(UUID turmaId, String nome, UUID professorId) {
        jdbcTemplate.update("INSERT INTO gestao_escolar.turmas "
                + "(id, nome, ano_criacao, turno, tipo, ativa, professor_id) "
                + "VALUES (?, ?, 2026, 'MANHA', 'REGULAR', TRUE, ?)",
                turmaId, nome, professorId);
    }

    private void criarAluno(UUID alunoId, String nome, String cpf, UUID turmaId) {
        jdbcTemplate.update("INSERT INTO apae_geral.pacientes "
                + "(id, nome_completo, data_de_nascimento, contato, cpf, is_aluno, is_apagado) "
                + "VALUES (?, ?, DATE '2013-01-01', '(83) 90000-1000', ?, TRUE, FALSE)",
                alunoId, nome, cpf);
        jdbcTemplate.update("INSERT INTO gestao_escolar.turma_aluno (turma_id, paciente_id, ativo) "
                + "VALUES (?, ?, TRUE)", turmaId, alunoId);
    }

    // ---- Tokens ----
    protected String tokenAdmin() {
        return jwtService.generateToken(ADMIN_EMAIL, "ADMIN");
    }

    protected String tokenProfessorA() {
        return jwtService.generateToken(PROFESSOR_A_EMAIL, "TEACHER");
    }

    protected String tokenProfessorB() {
        return jwtService.generateToken(PROFESSOR_B_EMAIL, "TEACHER");
    }

    /** Token expirado, assinado com a chave correta da aplicação. */
    protected String tokenExpirado(String subject, String role) {
        return construirToken(subject, role, JWT_SECRET, -60_000L);
    }

    /** Token ainda dentro do prazo, mas assinado com outra chave. */
    protected String tokenAssinaturaInvalida(String subject, String role) {
        return construirToken(subject, role, OUTRO_SEGREDO, 3_600_000L);
    }

    /** Texto que nem sequer é um JWT. */
    protected String tokenMalformado() {
        return "isto.nao-e-um.jwt";
    }

    protected String bearer(String token) {
        return "Bearer " + token;
    }

    private String construirToken(String subject, String role, String segredo, long deslocamentoExpiracaoMs) {
        long agora = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .claim("role", role)
                .setIssuedAt(new Date(agora - 120_000L))
                .setExpiration(new Date(agora + deslocamentoExpiracaoMs))
                .signWith(Keys.hmacShaKeyFor(segredo.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    // ---- Contrato do schema apae_geral ----
    private static void aplicarContratoApaeGeral() {
        try {
            Path contrato = Path.of("..", ".scripts", "db", "apae-geral-contract.sql");
            if (!Files.exists(contrato)) {
                contrato = Path.of(".scripts", "db", "apae-geral-contract.sql");
            }
            String sql = Files.readString(contrato);
            try (Connection conexao = DriverManager.getConnection(
                    POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
                 Statement statement = conexao.createStatement()) {
                statement.execute(sql);
            }
        } catch (IOException | SQLException e) {
            throw new IllegalStateException("Falha ao aplicar o contrato do schema apae_geral", e);
        }
    }
}
