package com.apae.gestao.service;

import com.apae.gestao.dto.aluno.AlunoDetalhesDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoItemDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaRequestDTO;
import com.apae.gestao.dto.avaliacao.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para {@link AlunoService}.
 *
 * Estratégia: todas as dependências são isoladas com @Mock do Mockito.
 * Cada grupo de cenários fica dentro de uma @Nested class para organização
 * e leitura fluente dos resultados no relatório do Maven.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AlunoService - Testes Unitários")
class AlunoServiceTest {

    // -------------------------------------------------------------------------
    // Dependências mockadas
    // -------------------------------------------------------------------------

    @Mock
    private AlunoViewRepository alunoRepository;

    @Mock
    private TurmaRepository turmaRepository;

    @Mock
    private TurmaAlunoRepository turmaAlunoRepository;

    @Mock
    private AvaliacaoRepository avaliacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AlunoService alunoService;

    // -------------------------------------------------------------------------
    // Fixtures reutilizáveis (criadas antes de cada teste)
    // -------------------------------------------------------------------------

    private UUID alunoId;
    private UUID turmaAtivaId;
    private UUID turmaInativaId;
    private UUID professorId;
    private UUID professorUsuarioId;

    private AlunoView alunoView;
    private Turma turmaAtiva;
    private Turma turmaInativa;
    private TurmaAluno vinculoAtivo;
    private Professor professor;
    private Usuario usuarioProfessor;
    private Avaliacao avaliacao;

    @BeforeEach
    void setUp() {
        // IDs
        alunoId            = UUID.randomUUID();
        turmaAtivaId       = UUID.randomUUID();
        turmaInativaId     = UUID.randomUUID();
        professorId        = UUID.randomUUID();
        professorUsuarioId = UUID.randomUUID();

        // AlunoView – visão somente-leitura do paciente
        alunoView = new AlunoView(
                alunoId,
                "Lucas Andrade",
                "111.222.333-44",
                LocalDate.of(2015, 8, 15),
                "(83) 99999-0000",
                null,
                true,
                false
        );

        // Turma ativa
        turmaAtiva = new Turma();
        turmaAtiva.setId(turmaAtivaId);
        turmaAtiva.setNome("Alfabetização 2025");
        turmaAtiva.setTurno("MANHA");
        turmaAtiva.setTipo("Educação Especial");
        turmaAtiva.setAnoCriacao(2025);
        turmaAtiva.setAtiva(true);

        // Turma inativa
        turmaInativa = new Turma();
        turmaInativa.setId(turmaInativaId);
        turmaInativa.setNome("Turma Encerrada 2023");
        turmaInativa.setTurno("TARDE");
        turmaInativa.setTipo("Educação Especial");
        turmaInativa.setAnoCriacao(2023);
        turmaInativa.setAtiva(false);

        // Vínculo ativo do aluno com a turma ativa
        vinculoAtivo = new TurmaAluno();
        vinculoAtivo.setId(UUID.randomUUID());
        vinculoAtivo.setTurma(turmaAtiva);
        vinculoAtivo.setPacienteId(alunoId);
        vinculoAtivo.setAtivo(true);

        // Professor e seu usuário (para nomeProfessor)
        professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(professorUsuarioId);

        usuarioProfessor = new Usuario();
        usuarioProfessor.setNomeCompleto("Prof. João Silva");

        // Avaliação associada ao aluno
        avaliacao = Avaliacao.builder()
                .id(UUID.randomUUID())
                .pacienteId(alunoId)
                .professor(professor)
                .descricao("Avaliação pedagógica semestral")
                .dataAvaliacao(LocalDateTime.now())
                .build();
    }

    // =========================================================================
    // 1. listarAlunosPorNome
    // =========================================================================

    @Nested
    @DisplayName("listarAlunosPorNome")
    class ListarAlunosPorNome {

        @Test
        @DisplayName("Deve delegar ao repositório de ativos quando apenasAtivos=true")
        void deveListarSomenteAtivosQuandoFlagForTrue() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            Page<AlunoResumoDTO> paginaMock = new PageImpl<>(
                    List.of(new AlunoResumoDTO(alunoId, "Lucas Andrade", null, "Alfabetização 2025"))
            );
            when(alunoRepository.listarAlunosAtivosPorFiltro("lucas", pageable))
                    .thenReturn(paginaMock);

            // When
            Page<AlunoResumoDTO> resultado = alunoService.listarAlunosPorNome("lucas", true, pageable);

            // Then
            assertThat(resultado.getTotalElements()).isEqualTo(1);
            assertThat(resultado.getContent().get(0).getNome()).isEqualTo("Lucas Andrade");
            verify(alunoRepository).listarAlunosAtivosPorFiltro("lucas", pageable);
            verify(alunoRepository, never()).listarAlunosPorFiltro(any(), any());
        }

        @Test
        @DisplayName("Deve delegar ao repositório geral quando apenasAtivos=false")
        void deveListarTodosQuandoFlagForFalse() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            Page<AlunoResumoDTO> paginaMock = new PageImpl<>(
                    List.of(new AlunoResumoDTO(alunoId, "Lucas Andrade", null, null))
            );
            when(alunoRepository.listarAlunosPorFiltro("lucas", pageable))
                    .thenReturn(paginaMock);

            // When
            Page<AlunoResumoDTO> resultado = alunoService.listarAlunosPorNome("lucas", false, pageable);

            // Then
            assertThat(resultado.getTotalElements()).isEqualTo(1);
            verify(alunoRepository).listarAlunosPorFiltro("lucas", pageable);
            verify(alunoRepository, never()).listarAlunosAtivosPorFiltro(any(), any());
        }

        @Test
        @DisplayName("Deve tratar nome nulo convertendo para string vazia no filtro")
        void deveTratarNomeNuloComoStringVazia() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            when(alunoRepository.listarAlunosPorFiltro("", pageable))
                    .thenReturn(Page.empty());

            // When
            alunoService.listarAlunosPorNome(null, false, pageable);

            // Then
            verify(alunoRepository).listarAlunosPorFiltro("", pageable);
        }

        @Test
        @DisplayName("Deve fazer trim do nome recebido antes de repassar ao repositório")
        void deveFazerTrimDoNome() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            when(alunoRepository.listarAlunosPorFiltro("lucas", pageable))
                    .thenReturn(Page.empty());

            // When
            alunoService.listarAlunosPorNome("  lucas  ", false, pageable);

            // Then
            verify(alunoRepository).listarAlunosPorFiltro("lucas", pageable);
        }
    }

    // =========================================================================
    // 2. atualizarTurma
    // =========================================================================

    @Nested
    @DisplayName("atualizarTurma")
    class AtualizarTurma {

        @Test
        @DisplayName("Cenário de Sucesso: deve inativar vínculo anterior e salvar novo vínculo ativo")
        void deveInativarVinculoAntigoECriarNovoVinculoAtivo() {
            // Given
            AlunoTurmaRequestDTO dto = new AlunoTurmaRequestDTO();
            dto.setNovaTurmaId(turmaAtivaId);

            TurmaAluno vinculoAntigo = new TurmaAluno();
            vinculoAntigo.setId(UUID.randomUUID());
            vinculoAntigo.setTurma(turmaAtiva);
            vinculoAntigo.setPacienteId(alunoId);
            vinculoAntigo.setAtivo(true);

            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaRepository.findById(turmaAtivaId)).thenReturn(Optional.of(turmaAtiva));
            when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId))
                    .thenReturn(List.of(vinculoAntigo));
            // Simula que o aluno ainda não possui vínculo com a nova turma (orElseGet cria um novo)
            when(turmaAlunoRepository.findByTurmaAndPacienteId(turmaAtiva, alunoId))
                    .thenReturn(Optional.empty());

            // When
            AlunoDetalhesDTO resultado = alunoService.atualizarTurma(alunoId, dto);

            // Then
            ArgumentCaptor<TurmaAluno> captor = ArgumentCaptor.forClass(TurmaAluno.class);
            verify(turmaAlunoRepository, atLeast(2)).save(captor.capture());

            List<TurmaAluno> salvos = captor.getAllValues();
            TurmaAluno vinculoSalvoComoInativo = salvos.get(0);
            TurmaAluno novoVinculo             = salvos.get(1);

            assertThat(vinculoSalvoComoInativo.getAtivo()).isFalse();
            assertThat(novoVinculo.getAtivo()).isTrue();
            assertThat(novoVinculo.getPacienteId()).isEqualTo(alunoId);
            assertThat(resultado.getNomeTurmaAtual()).isEqualTo("Alfabetização 2025");
        }

        @Test
        @DisplayName("Cenário de Sucesso: deve reativar vínculo existente quando aluno já passou pela turma")
        void deveReativarVinculoExistenteQuandoAlunoJaEstevaNaTurma() {
            // Given
            UUID novaTurmaId = UUID.randomUUID();
            Turma novaTurma = new Turma();
            novaTurma.setId(novaTurmaId);
            novaTurma.setNome("Turma Retorno 2025");
            novaTurma.setTurno("TARDE");
            novaTurma.setAtiva(true);

            TurmaAluno vinculoAnteriorInativo = new TurmaAluno();
            vinculoAnteriorInativo.setId(UUID.randomUUID());
            vinculoAnteriorInativo.setTurma(novaTurma);
            vinculoAnteriorInativo.setPacienteId(alunoId);
            vinculoAnteriorInativo.setAtivo(false);

            AlunoTurmaRequestDTO dto = new AlunoTurmaRequestDTO();
            dto.setNovaTurmaId(novaTurmaId);

            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaRepository.findById(novaTurmaId)).thenReturn(Optional.of(novaTurma));
            when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId)).thenReturn(List.of());
            when(turmaAlunoRepository.findByTurmaAndPacienteId(novaTurma, alunoId))
                    .thenReturn(Optional.of(vinculoAnteriorInativo));

            // When
            AlunoDetalhesDTO resultado = alunoService.atualizarTurma(alunoId, dto);

            // Then
            ArgumentCaptor<TurmaAluno> captor = ArgumentCaptor.forClass(TurmaAluno.class);
            verify(turmaAlunoRepository).save(captor.capture());

            TurmaAluno vinculoSalvo = captor.getValue();
            assertThat(vinculoSalvo.getAtivo()).isTrue();
            assertThat(vinculoSalvo).isSameAs(vinculoAnteriorInativo);
            assertThat(resultado.getNomeTurmaAtual()).isEqualTo("Turma Retorno 2025");
        }

        @Test
        @DisplayName("Cenário de Falha: deve lançar 422 ao tentar matricular em turma inativa")
        void deveLancarExcecaoAoTentarMatricularEmTurmaInativa() {
            // Given
            AlunoTurmaRequestDTO dto = new AlunoTurmaRequestDTO();
            dto.setNovaTurmaId(turmaInativaId);

            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaRepository.findById(turmaInativaId)).thenReturn(Optional.of(turmaInativa));

            // When / Then
            assertThatThrownBy(() -> alunoService.atualizarTurma(alunoId, dto))
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(ex -> {
                        ResponseStatusException rse = (ResponseStatusException) ex;
                        assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
                        assertThat(rse.getReason())
                                .contains("Não é possível adicionar aluno em uma turma inativa");
                    });

            verify(turmaAlunoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Cenário de Falha: deve lançar RuntimeException quando turma não for encontrada")
        void deveLancarExcecaoQuandoTurmaNaoForEncontrada() {
            // Given
            UUID turmaInexistenteId = UUID.randomUUID();
            AlunoTurmaRequestDTO dto = new AlunoTurmaRequestDTO();
            dto.setNovaTurmaId(turmaInexistenteId);

            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaRepository.findById(turmaInexistenteId)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> alunoService.atualizarTurma(alunoId, dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Turma não encontrada");

            verify(turmaAlunoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Cenário de Falha: deve lançar RuntimeException quando aluno não existir")
        void deveLancarExcecaoQuandoAlunoNaoForEncontrado() {
            // Given
            UUID alunoInexistenteId = UUID.randomUUID();
            AlunoTurmaRequestDTO dto = new AlunoTurmaRequestDTO();
            dto.setNovaTurmaId(turmaAtivaId);

            when(alunoRepository.findById(alunoInexistenteId)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> alunoService.atualizarTurma(alunoInexistenteId, dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Aluno não encontrado");
        }
    }

    // =========================================================================
    // 3. buscarHistoricoTurmasPorAlunoId
    // =========================================================================

    @Nested
    @DisplayName("buscarHistoricoTurmasPorAlunoId")
    class BuscarHistoricoTurmasPorAlunoId {

        @Test
        @DisplayName("Deve retornar lista mapeada de AlunoTurmaHistoricoResponseDTO para o aluno")
        void deveRetornarHistoricoMapeadoParaDTO() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findHistoricoCompletoPorPaciente(alunoId))
                    .thenReturn(List.of(vinculoAtivo));

            // When
            List<AlunoTurmaHistoricoResponseDTO> resultado =
                    alunoService.buscarHistoricoTurmasPorAlunoId(alunoId);

            // Then
            assertThat(resultado).hasSize(1);
            AlunoTurmaHistoricoResponseDTO item = resultado.get(0);
            assertThat(item.getTurmaId()).isEqualTo(turmaAtivaId);
            assertThat(item.getTurno()).isEqualTo("MANHA");
            assertThat(item.getTipo()).isEqualTo("Educação Especial");
            assertThat(item.getAno()).isEqualTo(2025);
            assertThat(item.getTurmaAtual()).isTrue();
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando aluno não possui histórico")
        void deveRetornarListaVaziaQuandoSemHistorico() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findHistoricoCompletoPorPaciente(alunoId))
                    .thenReturn(List.of());

            // When
            List<AlunoTurmaHistoricoResponseDTO> resultado =
                    alunoService.buscarHistoricoTurmasPorAlunoId(alunoId);

            // Then
            assertThat(resultado).isEmpty();
        }

        @Test
        @DisplayName("Deve lançar exceção quando aluno não existir ao buscar histórico")
        void deveLancarExcecaoQuandoAlunoNaoExistir() {
            // Given
            UUID idInexistente = UUID.randomUUID();
            when(alunoRepository.findById(idInexistente)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> alunoService.buscarHistoricoTurmasPorAlunoId(idInexistente))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Aluno não encontrado");
        }
    }

    // =========================================================================
    // 4. buscarAvaliacoesPorAlunoId
    // =========================================================================

    @Nested
    @DisplayName("buscarAvaliacoesPorAlunoId")
    class BuscarAvaliacoesPorAlunoId {

        @Test
        @DisplayName("Deve retornar avaliações mapeadas com nome do professor e turma atual")
        void deveRetornarAvaliacoesMapeadasComNomeProfessorETurma() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId))
                    .thenReturn(List.of(vinculoAtivo));
            when(avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(alunoId))
                    .thenReturn(List.of(avaliacao));
            when(usuarioRepository.findById(professorUsuarioId))
                    .thenReturn(Optional.of(usuarioProfessor));

            // When
            List<AvaliacaoHistoricoResponseDTO> resultado =
                    alunoService.buscarAvaliacoesPorAlunoId(alunoId);

            // Then
            assertThat(resultado).hasSize(1);
            AvaliacaoHistoricoResponseDTO item = resultado.get(0);
            assertThat(item.getDescricao()).isEqualTo("Avaliação pedagógica semestral");
            assertThat(item.getProfessorNome()).isEqualTo("Prof. João Silva");
            assertThat(item.getTurmaNomeCompleto()).isEqualTo("Alfabetização 2025");
        }

        @Test
        @DisplayName("Deve usar 'Sem turma ativa' quando aluno não possui turma vinculada")
        void deveUsarTextoDefaultQuandoSemTurmaAtiva() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId))
                    .thenReturn(List.of());
            when(avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(alunoId))
                    .thenReturn(List.of(avaliacao));
            when(usuarioRepository.findById(professorUsuarioId))
                    .thenReturn(Optional.of(usuarioProfessor));

            // When
            List<AvaliacaoHistoricoResponseDTO> resultado =
                    alunoService.buscarAvaliacoesPorAlunoId(alunoId);

            // Then
            assertThat(resultado).hasSize(1);
            assertThat(resultado.get(0).getTurmaNomeCompleto()).isEqualTo("Sem turma ativa");
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando aluno não possui avaliações")
        void deveRetornarListaVaziaQuandoSemAvaliacoes() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId))
                    .thenReturn(List.of());
            when(avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(alunoId))
                    .thenReturn(List.of());

            // When
            List<AvaliacaoHistoricoResponseDTO> resultado =
                    alunoService.buscarAvaliacoesPorAlunoId(alunoId);

            // Then
            assertThat(resultado).isEmpty();
        }

        @Test
        @DisplayName("Deve lançar exceção quando aluno não existir ao buscar avaliações")
        void deveLancarExcecaoQuandoAlunoNaoExistir() {
            // Given
            UUID idInexistente = UUID.randomUUID();
            when(alunoRepository.findById(idInexistente)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> alunoService.buscarAvaliacoesPorAlunoId(idInexistente))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Aluno não encontrado");
        }
    }

    // =========================================================================
    // 5. listarHistoricoTurmasPorAlunoId
    // =========================================================================

    @Nested
    @DisplayName("listarHistoricoTurmasPorAlunoId")
    class ListarHistoricoTurmasPorAlunoId {

        @Test
        @DisplayName("Deve retornar lista mapeada de AlunoTurmaHistoricoItemDTO corretamente")
        void deveRetornarHistoricoItemDTOMapeadoCorretamente() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findAllHistoricoByPaciente(alunoId))
                    .thenReturn(List.of(vinculoAtivo));

            // When
            List<AlunoTurmaHistoricoItemDTO> resultado =
                    alunoService.listarHistoricoTurmasPorAlunoId(alunoId);

            // Then
            assertThat(resultado).hasSize(1);
            AlunoTurmaHistoricoItemDTO item = resultado.get(0);
            assertThat(item.getId()).isEqualTo(turmaAtivaId);
            assertThat(item.getNome()).isEqualTo("Alfabetização 2025");
            assertThat(item.getTurno()).isEqualTo("MANHA");
            assertThat(item.getAnoCriacao()).isEqualTo(2025);
            assertThat(item.getAtiva()).isTrue();
            assertThat(item.getAlunoAtivo()).isTrue();
            assertThat(item.getHorario()).isEqualTo("Segunda a Sexta - 8h as 12h");
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando aluno não possui nenhum histórico")
        void deveRetornarListaVaziaQuandoSemHistorico() {
            // Given
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(alunoView));
            when(turmaAlunoRepository.findAllHistoricoByPaciente(alunoId))
                    .thenReturn(List.of());

            // When
            List<AlunoTurmaHistoricoItemDTO> resultado =
                    alunoService.listarHistoricoTurmasPorAlunoId(alunoId);

            // Then
            assertThat(resultado).isEmpty();
        }
    }
}
