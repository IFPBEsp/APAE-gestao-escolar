package com.apae.gestao.service;

import com.apae.gestao.dto.relatorio.RelatorioRequestDTO;
import com.apae.gestao.dto.relatorio.RelatorioResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Relatorio;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.RelatorioRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RelatorioService - Testes Unitários")
class RelatorioServiceTest {

    @Mock
    private RelatorioRepository relatorioRepository;

    @Mock
    private AlunoViewRepository alunoRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private TurmaRepository turmaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private RelatorioService relatorioService;

    private UUID relatorioId;
    private UUID alunoId;
    private UUID professorId;
    private UUID professorUsuarioId;
    private UUID turmaId;

    private AlunoView aluno;
    private Professor professor;
    private Turma turma;
    private Usuario usuarioProfessor;
    private Relatorio relatorio;
    private RelatorioRequestDTO request;

    @BeforeEach
    void setUp() {
        relatorioId = UUID.randomUUID();
        alunoId = UUID.randomUUID();
        professorId = UUID.randomUUID();
        professorUsuarioId = UUID.randomUUID();
        turmaId = UUID.randomUUID();

        aluno = new AlunoView(
                alunoId,
                "Lucas Andrade",
                "111.222.333-44",
                LocalDate.of(2015, 8, 15),
                "(83) 99999-0000",
                null,
                true,
                false
        );

        professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(professorUsuarioId);

        turma = new Turma();
        turma.setId(turmaId);
        turma.setNome("Turma A");

        usuarioProfessor = new Usuario();
        usuarioProfessor.setId(professorUsuarioId);
        usuarioProfessor.setNomeCompleto("Maria Silva");

        relatorio = new Relatorio();
        relatorio.setId(relatorioId);
        relatorio.setPacienteId(alunoId);
        relatorio.setAtividades("Atividades realizadas");
        relatorio.setHabilidades("Habilidades desenvolvidas");
        relatorio.setEstrategias("Estratégias utilizadas");
        relatorio.setRecursos("Recursos utilizados");
        relatorio.setCreatedAt(LocalDateTime.of(2026, 10, 17, 10, 0));
        relatorio.setProfessor(professor);
        relatorio.setTurma(turma);

        request = new RelatorioRequestDTO(
                "Novas atividades",
                "Melhoria na comunicação",
                "Reforço positivo",
                "Materiais adaptados",
                alunoId,
                turmaId,
                professorId
        );
    }

    private void configurarMapeamentoDoRelatorio() {
        when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
        when(usuarioRepository.findById(professorUsuarioId))
                .thenReturn(Optional.of(usuarioProfessor));
    }

    @Nested
    @DisplayName("listarTodos")
    class ListarTodos {

        @Test
        @DisplayName("Deve retornar relatórios convertidos para DTO")
        void deveRetornarRelatoriosMapeadosParaDTO() {
            configurarMapeamentoDoRelatorio();
            when(relatorioRepository.findAll()).thenReturn(List.of(relatorio));

            List<RelatorioResponseDTO> resultado = relatorioService.listarTodos();

            assertThat(resultado).hasSize(1);
            assertThat(resultado.get(0).getId()).isEqualTo(relatorioId);
            assertThat(resultado.get(0).getAlunoId()).isEqualTo(alunoId);
            assertThat(resultado.get(0).getAlunoNome()).isEqualTo("Lucas Andrade");
            assertThat(resultado.get(0).getAlunoDataNascimento())
                    .isEqualTo(LocalDate.of(2015, 8, 15));
            assertThat(resultado.get(0).getTurmaNome()).isEqualTo("Turma A");
            assertThat(resultado.get(0).getProfessorNome()).isEqualTo("Maria Silva");
            assertThat(resultado.get(0).getAtividades()).isEqualTo("Atividades realizadas");

            verify(relatorioRepository).findAll();
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando não houver relatórios")
        void deveRetornarListaVaziaQuandoNaoExistiremRelatorios() {
            when(relatorioRepository.findAll()).thenReturn(List.of());

            List<RelatorioResponseDTO> resultado = relatorioService.listarTodos();

            assertThat(resultado).isEmpty();
        }
    }

    @Nested
    @DisplayName("buscarPorId")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar relatório quando o ID existir")
        void deveRetornarRelatorioQuandoEncontrado() {
            configurarMapeamentoDoRelatorio();
            when(relatorioRepository.findById(relatorioId))
                    .thenReturn(Optional.of(relatorio));

            RelatorioResponseDTO resultado = relatorioService.buscarPorId(relatorioId);

            assertThat(resultado.getId()).isEqualTo(relatorioId);
            assertThat(resultado.getAtividades()).isEqualTo("Atividades realizadas");
            assertThat(resultado.getHabilidades()).isEqualTo("Habilidades desenvolvidas");
            assertThat(resultado.getEstrategias()).isEqualTo("Estratégias utilizadas");
            assertThat(resultado.getRecursos()).isEqualTo("Recursos utilizados");
            assertThat(resultado.getProfessorNome()).isEqualTo("Maria Silva");
        }

        @Test
        @DisplayName("Deve lançar exceção quando o relatório não existir")
        void deveLancarExcecaoQuandoRelatorioNaoExistir() {
            UUID idInexistente = UUID.randomUUID();
            when(relatorioRepository.findById(idInexistente))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> relatorioService.buscarPorId(idInexistente))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Relatório não encontrado");
        }
    }

    @Nested
    @DisplayName("criar")
    class Criar {

        @Test
        @DisplayName("Deve criar relatório com os dados e associações informados")
        void deveCriarRelatorioComDadosCorretos() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(professorRepository.findById(professorId))
                    .thenReturn(Optional.of(professor));
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(usuarioRepository.findById(professorUsuarioId))
                    .thenReturn(Optional.of(usuarioProfessor));
            when(relatorioRepository.save(any(Relatorio.class))).thenAnswer(invocation -> {
                Relatorio salvo = invocation.getArgument(0);
                salvo.setId(relatorioId);
                salvo.setCreatedAt(LocalDateTime.of(2026, 10, 20, 10, 0));
                return salvo;
            });

            RelatorioResponseDTO resultado = relatorioService.criar(request);

            assertThat(resultado.getId()).isEqualTo(relatorioId);
            assertThat(resultado.getAlunoId()).isEqualTo(alunoId);
            assertThat(resultado.getAtividades()).isEqualTo("Novas atividades");
            assertThat(resultado.getHabilidades()).isEqualTo("Melhoria na comunicação");
            assertThat(resultado.getEstrategias()).isEqualTo("Reforço positivo");
            assertThat(resultado.getRecursos()).isEqualTo("Materiais adaptados");
            assertThat(resultado.getAlunoNome()).isEqualTo("Lucas Andrade");
            assertThat(resultado.getTurmaNome()).isEqualTo("Turma A");
            assertThat(resultado.getProfessorNome()).isEqualTo("Maria Silva");

            verify(relatorioRepository).save(any(Relatorio.class));
        }

        @Test
        @DisplayName("Deve lançar exceção quando o aluno não existir")
        void deveLancarExcecaoQuandoAlunoNaoExistir() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> relatorioService.criar(request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Aluno não encontrado");

            verify(relatorioRepository, never()).save(any(Relatorio.class));
        }

        @Test
        @DisplayName("Deve lançar exceção quando o professor não existir")
        void deveLancarExcecaoQuandoProfessorNaoExistir() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(professorRepository.findById(professorId))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> relatorioService.criar(request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Professor não encontrado");

            verify(relatorioRepository, never()).save(any(Relatorio.class));
        }

        @Test
        @DisplayName("Deve lançar exceção quando a turma não existir")
        void deveLancarExcecaoQuandoTurmaNaoExistir() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(professorRepository.findById(professorId))
                    .thenReturn(Optional.of(professor));
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> relatorioService.criar(request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Turma não encontrada");

            verify(relatorioRepository, never()).save(any(Relatorio.class));
        }
    }

    @Nested
    @DisplayName("atualizar")
    class Atualizar {

        @Test
        @DisplayName("Deve atualizar os dados de um relatório existente")
        void deveAtualizarRelatorioExistente() {
            when(relatorioRepository.findById(relatorioId))
                    .thenReturn(Optional.of(relatorio));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(professorRepository.findById(professorId))
                    .thenReturn(Optional.of(professor));
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(usuarioRepository.findById(professorUsuarioId))
                    .thenReturn(Optional.of(usuarioProfessor));
            when(relatorioRepository.save(any(Relatorio.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            RelatorioResponseDTO resultado = relatorioService.atualizar(relatorioId, request);

            assertThat(resultado.getId()).isEqualTo(relatorioId);
            assertThat(resultado.getAtividades()).isEqualTo("Novas atividades");
            assertThat(resultado.getHabilidades()).isEqualTo("Melhoria na comunicação");
            assertThat(resultado.getEstrategias()).isEqualTo("Reforço positivo");
            assertThat(resultado.getRecursos()).isEqualTo("Materiais adaptados");

            verify(relatorioRepository).save(relatorio);
        }

        @Test
        @DisplayName("Deve lançar exceção quando o relatório não existir")
        void deveLancarExcecaoQuandoRelatorioNaoExistir() {
            UUID idInexistente = UUID.randomUUID();
            when(relatorioRepository.findById(idInexistente))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> relatorioService.atualizar(idInexistente, request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Relatório não encontrado");

            verify(relatorioRepository, never()).save(any(Relatorio.class));
        }
    }

    @Nested
    @DisplayName("deletar")
    class Deletar {

        @Test
        @DisplayName("Deve excluir relatório quando o ID existir")
        void deveExcluirRelatorioExistente() {
            when(relatorioRepository.existsById(relatorioId)).thenReturn(true);

            relatorioService.deletar(relatorioId);

            verify(relatorioRepository).existsById(relatorioId);
            verify(relatorioRepository).deleteById(relatorioId);
        }

        @Test
        @DisplayName("Deve lançar exceção quando tentar excluir relatório inexistente")
        void deveLancarExcecaoAoExcluirRelatorioInexistente() {
            when(relatorioRepository.existsById(relatorioId)).thenReturn(false);

            assertThatThrownBy(() -> relatorioService.deletar(relatorioId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Relatório não encontrado");

            verify(relatorioRepository, never()).deleteById(any(UUID.class));
        }
    }

    @Nested
    @DisplayName("buscarPorAluno")
    class BuscarPorAluno {

        @Test
        @DisplayName("Deve retornar relatórios associados ao aluno")
        void deveRetornarRelatoriosDoAluno() {
            configurarMapeamentoDoRelatorio();
            when(relatorioRepository.findByPacienteId(alunoId))
                    .thenReturn(List.of(relatorio));

            List<RelatorioResponseDTO> resultado =
                    relatorioService.buscarPorAluno(alunoId);

            assertThat(resultado).hasSize(1);
            assertThat(resultado.get(0).getAlunoId()).isEqualTo(alunoId);
            assertThat(resultado.get(0).getAlunoNome()).isEqualTo("Lucas Andrade");

            verify(relatorioRepository).findByPacienteId(alunoId);
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando o aluno não possuir relatórios")
        void deveRetornarListaVaziaQuandoAlunoNaoPossuirRelatorios() {
            when(relatorioRepository.findByPacienteId(alunoId)).thenReturn(List.of());

            List<RelatorioResponseDTO> resultado =
                    relatorioService.buscarPorAluno(alunoId);

            assertThat(resultado).isEmpty();
        }
    }

    @Nested
    @DisplayName("Mapeamento do DTO")
    class MapeamentoDTO {

        @Test
        @DisplayName("Deve permitir dados opcionais quando aluno ou professor não forem encontrados")
        void devePermitirDadosOpcionaisAusentes() {
            relatorio.setProfessor(null);
            relatorio.setTurma(null);

            when(relatorioRepository.findById(relatorioId))
                    .thenReturn(Optional.of(relatorio));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            RelatorioResponseDTO resultado = relatorioService.buscarPorId(relatorioId);

            assertThat(resultado.getId()).isEqualTo(relatorioId);
            assertThat(resultado.getAlunoNome()).isNull();
            assertThat(resultado.getAlunoDataNascimento()).isNull();
            assertThat(resultado.getTurmaNome()).isNull();
            assertThat(resultado.getProfessorNome()).isNull();

            verifyNoInteractions(usuarioRepository);
        }

        @Test
        @DisplayName("Deve retornar nome do professor nulo quando o usuário não existir")
        void deveRetornarNomeProfessorNuloQuandoUsuarioNaoExistir() {
            when(relatorioRepository.findById(relatorioId))
                    .thenReturn(Optional.of(relatorio));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(usuarioRepository.findById(professorUsuarioId))
                    .thenReturn(Optional.empty());

            RelatorioResponseDTO resultado = relatorioService.buscarPorId(relatorioId);

            assertThat(resultado.getAlunoNome()).isEqualTo("Lucas Andrade");
            assertThat(resultado.getProfessorNome()).isNull();
        }
    }
}
