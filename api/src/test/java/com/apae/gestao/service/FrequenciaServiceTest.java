package com.apae.gestao.service;

import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FrequenciaService - Testes Unitários")
class FrequenciaServiceTest {

    @Mock
    private TurmaRepository turmaRepository;

    @Mock
    private AlunoViewRepository alunoRepository;

    @InjectMocks
    private FrequenciaService frequenciaService;

    private UUID turmaId;
    private UUID alunoId;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        turmaId = UUID.randomUUID();
        alunoId = UUID.randomUUID();
        pageable = PageRequest.of(2, 5, Sort.by("nome"));
    }

    @Nested
    @DisplayName("getResumoTurma")
    class GetResumoTurma {

        @Test
        @DisplayName("Deve consultar o repositório com o turmaId e retornar o resumo devolvido")
        void deveRetornarResumoDevolvidoPeloRepositorio() {
            TurmaResumoFrequenciaDTO resumo = mock(TurmaResumoFrequenciaDTO.class);
            when(turmaRepository.getResumoFrequenciaTurma(turmaId)).thenReturn(resumo);

            TurmaResumoFrequenciaDTO resultado = frequenciaService.getResumoTurma(turmaId);

            assertThat(resultado).isSameAs(resumo);
            verify(turmaRepository).getResumoFrequenciaTurma(turmaId);
            verifyNoMoreInteractions(turmaRepository);
            verifyNoInteractions(alunoRepository);
        }

        @Test
        @DisplayName("Deve retornar null, sem lançar exceção, quando o repositório não retorna resumo")
        void deveRetornarNullQuandoRepositorioNaoRetornaResumo() {
            when(turmaRepository.getResumoFrequenciaTurma(turmaId)).thenReturn(null);

            TurmaResumoFrequenciaDTO resultado = frequenciaService.getResumoTurma(turmaId);

            assertThat(resultado).isNull();
            verify(turmaRepository).getResumoFrequenciaTurma(turmaId);
            verifyNoMoreInteractions(turmaRepository);
            verifyNoInteractions(alunoRepository);
        }

        @Test
        @DisplayName("Deve propagar a exceção lançada pelo repositório")
        void devePropagarExcecaoLancadaPeloRepositorio() {
            RuntimeException erro = new RuntimeException("Falha ao consultar o resumo da turma");
            when(turmaRepository.getResumoFrequenciaTurma(turmaId)).thenThrow(erro);

            assertThatThrownBy(() -> frequenciaService.getResumoTurma(turmaId))
                    .isSameAs(erro);

            verify(turmaRepository).getResumoFrequenciaTurma(turmaId);
            verifyNoMoreInteractions(turmaRepository);
            verifyNoInteractions(alunoRepository);
        }
    }

    @Nested
    @DisplayName("listarAlunos")
    class ListarAlunos {

        @Test
        @DisplayName("Deve consultar com turmaId e Pageable e retornar a página devolvida")
        void deveRetornarPaginaDevolvidaPeloRepositorio() {
            AlunoFrequenciaResumoDTO primeiro = mock(AlunoFrequenciaResumoDTO.class);
            AlunoFrequenciaResumoDTO segundo = mock(AlunoFrequenciaResumoDTO.class);
            Page<AlunoFrequenciaResumoDTO> pagina =
                    new PageImpl<>(List.of(primeiro, segundo), pageable, 12);
            when(alunoRepository.listarFrequenciaAlunosDaTurma(turmaId, pageable))
                    .thenReturn(pagina);

            Page<AlunoFrequenciaResumoDTO> resultado =
                    frequenciaService.listarAlunos(turmaId, pageable);

            assertThat(resultado).isSameAs(pagina);
            assertThat(resultado.getContent()).containsExactly(primeiro, segundo);
            assertThat(resultado.getTotalElements()).isEqualTo(12);
            verify(alunoRepository).listarFrequenciaAlunosDaTurma(eq(turmaId), same(pageable));
            verifyNoMoreInteractions(alunoRepository);
            verifyNoInteractions(turmaRepository);
        }

        @Test
        @DisplayName("Deve retornar a página vazia sem alterações")
        void deveRetornarPaginaVaziaSemAlteracoes() {
            Page<AlunoFrequenciaResumoDTO> paginaVazia = Page.empty(pageable);
            when(alunoRepository.listarFrequenciaAlunosDaTurma(turmaId, pageable))
                    .thenReturn(paginaVazia);

            Page<AlunoFrequenciaResumoDTO> resultado =
                    frequenciaService.listarAlunos(turmaId, pageable);

            assertThat(resultado).isSameAs(paginaVazia);
            assertThat(resultado.isEmpty()).isTrue();
            assertThat(resultado.getTotalElements()).isZero();
            verify(alunoRepository).listarFrequenciaAlunosDaTurma(eq(turmaId), same(pageable));
            verifyNoMoreInteractions(alunoRepository);
            verifyNoInteractions(turmaRepository);
        }

        @Test
        @DisplayName("Deve propagar a exceção lançada pelo repositório")
        void devePropagarExcecaoLancadaPeloRepositorio() {
            RuntimeException erro = new RuntimeException("Falha ao listar a frequência dos alunos");
            when(alunoRepository.listarFrequenciaAlunosDaTurma(turmaId, pageable))
                    .thenThrow(erro);

            assertThatThrownBy(() -> frequenciaService.listarAlunos(turmaId, pageable))
                    .isSameAs(erro);

            verify(alunoRepository).listarFrequenciaAlunosDaTurma(eq(turmaId), same(pageable));
            verifyNoMoreInteractions(alunoRepository);
            verifyNoInteractions(turmaRepository);
        }
    }

    @Nested
    @DisplayName("getHistoricoIndividualAluno")
    class GetHistoricoIndividualAluno {

        @Test
        @DisplayName("Deve consultar com alunoId e Pageable e retornar a página devolvida")
        void deveRetornarPaginaDevolvidaPeloRepositorio() {
            AulaPresencaAlunoResponseDTO primeira = mock(AulaPresencaAlunoResponseDTO.class);
            AulaPresencaAlunoResponseDTO segunda = mock(AulaPresencaAlunoResponseDTO.class);
            Page<AulaPresencaAlunoResponseDTO> pagina =
                    new PageImpl<>(List.of(primeira, segunda), pageable, 12);
            when(alunoRepository.listarHistoricoAluno(alunoId, pageable)).thenReturn(pagina);

            Page<AulaPresencaAlunoResponseDTO> resultado =
                    frequenciaService.getHistoricoIndividualAluno(alunoId, pageable);

            assertThat(resultado).isSameAs(pagina);
            assertThat(resultado.getContent()).containsExactly(primeira, segunda);
            assertThat(resultado.getTotalElements()).isEqualTo(12);
            verify(alunoRepository).listarHistoricoAluno(eq(alunoId), same(pageable));
            verifyNoMoreInteractions(alunoRepository);
            verifyNoInteractions(turmaRepository);
        }

        @Test
        @DisplayName("Deve retornar a página vazia sem alterações")
        void deveRetornarPaginaVaziaSemAlteracoes() {
            Page<AulaPresencaAlunoResponseDTO> paginaVazia = Page.empty(pageable);
            when(alunoRepository.listarHistoricoAluno(alunoId, pageable)).thenReturn(paginaVazia);

            Page<AulaPresencaAlunoResponseDTO> resultado =
                    frequenciaService.getHistoricoIndividualAluno(alunoId, pageable);

            assertThat(resultado).isSameAs(paginaVazia);
            assertThat(resultado.isEmpty()).isTrue();
            assertThat(resultado.getTotalElements()).isZero();
            verify(alunoRepository).listarHistoricoAluno(eq(alunoId), same(pageable));
            verifyNoMoreInteractions(alunoRepository);
            verifyNoInteractions(turmaRepository);
        }

        @Test
        @DisplayName("Deve propagar a exceção lançada pelo repositório")
        void devePropagarExcecaoLancadaPeloRepositorio() {
            RuntimeException erro = new RuntimeException("Falha ao consultar o histórico do aluno");
            when(alunoRepository.listarHistoricoAluno(alunoId, pageable)).thenThrow(erro);

            assertThatThrownBy(() -> frequenciaService.getHistoricoIndividualAluno(alunoId, pageable))
                    .isSameAs(erro);

            verify(alunoRepository).listarHistoricoAluno(eq(alunoId), same(pageable));
            verifyNoMoreInteractions(alunoRepository);
            verifyNoInteractions(turmaRepository);
        }
    }
}
