package com.apae.gestao.service;

import com.apae.gestao.dto.avaliacao.AvaliacaoRequestDTO;
import com.apae.gestao.dto.avaliacao.AvaliacaoResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
@DisplayName("AvaliacaoService - Testes Unitários")
class AvaliacaoServiceTest {

    @Mock
    private AvaliacaoRepository avaliacaoRepository;

    @Mock
    private AlunoViewRepository alunoRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private TurmaAlunoRepository turmaAlunoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AvaliacaoService avaliacaoService;

    private UUID avaliacaoId;
    private UUID alunoId;
    private UUID professorId;
    private UUID usuarioId;
    private LocalDateTime dataAvaliacao;
    private AlunoView aluno;
    private Professor professor;
    private Usuario usuario;
    private Avaliacao avaliacao;
    private AvaliacaoRequestDTO request;
    private Turma turma;
    private TurmaAluno turmaAluno;

    @BeforeEach
    void setUp() {
        avaliacaoId = UUID.randomUUID();
        alunoId = UUID.randomUUID();
        professorId = UUID.randomUUID();
        usuarioId = UUID.randomUUID();
        dataAvaliacao = LocalDateTime.of(2026, 10, 20, 10, 30);

        aluno = new AlunoView(
                alunoId, "Maria da Silva", "111.222.333-44",
                LocalDate.of(2015, 8, 15), "(83) 99999-0000", null, true, false
        );

        professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(usuarioId);

        usuario = new Usuario();
        usuario.setNomeCompleto("João da Silva");

        turma = new Turma();
        turma.setId(UUID.randomUUID());
        turma.setNome("Turma A");
        turma.setTurno("MANHA");

        turmaAluno = new TurmaAluno();
        turmaAluno.setId(UUID.randomUUID());
        turmaAluno.setTurma(turma);
        turmaAluno.setPacienteId(alunoId);
        turmaAluno.setAtivo(true);

        avaliacao = Avaliacao.builder()
                .id(avaliacaoId)
                .descricao("Avaliação pedagógica")
                .dataAvaliacao(dataAvaliacao)
                .pacienteId(alunoId)
                .professor(professor)
                .build();

        request = AvaliacaoRequestDTO.builder()
                .descricao("Avaliação pedagógica")
                .alunoId(alunoId)
                .professorId(professorId)
                .build();
    }

    private void configurarRelacionamentos() {
        when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId))
                .thenReturn(List.of(turmaAluno));
    }

    private void configurarSave() {
        when(avaliacaoRepository.save(any(Avaliacao.class))).thenAnswer(invocation -> {
            Avaliacao salva = invocation.getArgument(0);
            salva.setId(avaliacaoId);
            salva.setDataAvaliacao(dataAvaliacao);
            return salva;
        });
    }

    @Nested
    @DisplayName("criar")
    class Criar {

        @Test
        @DisplayName("Deve criar avaliação e retornar os dados relacionados")
        void deveCriarAvaliacao() {
            configurarRelacionamentos();
            configurarSave();
            when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));

            AvaliacaoResponseDTO resposta = avaliacaoService.criar(request);

            assertThat(resposta.getId()).isEqualTo(avaliacaoId);
            assertThat(resposta.getDescricao()).isEqualTo("Avaliação pedagógica");
            assertThat(resposta.getAlunoId()).isEqualTo(alunoId);
            assertThat(resposta.getAlunoNome()).isEqualTo("Maria da Silva");
            assertThat(resposta.getProfessorId()).isEqualTo(professorId);
            assertThat(resposta.getProfessorNome()).isEqualTo("João da Silva");
            assertThat(resposta.getTurmaNomeCompleto()).isEqualTo("Turma A - MANHA");
            assertThat(resposta.getDataAvaliacao()).isEqualTo(dataAvaliacao);

            ArgumentCaptor<Avaliacao> captor = ArgumentCaptor.forClass(Avaliacao.class);
            verify(avaliacaoRepository).save(captor.capture());
            assertThat(captor.getValue().getDescricao()).isEqualTo(request.getDescricao());
            assertThat(captor.getValue().getPacienteId()).isEqualTo(alunoId);
            assertThat(captor.getValue().getProfessor()).isEqualTo(professor);
        }

        @Test
        @DisplayName("Deve lançar exceção quando o aluno não existe")
        void deveFalharQuandoAlunoNaoExiste() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.criar(request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Aluno não encontrado");

            verify(professorRepository, never()).findById(any());
            verify(avaliacaoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar exceção quando o professor não existe")
        void deveFalharQuandoProfessorNaoExiste() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(professorRepository.findById(professorId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.criar(request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Professor não encontrado");

            verify(avaliacaoRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("listarTodas")
    class ListarTodas {

        @Test
        @DisplayName("Deve listar avaliações")
        void deveListarAvaliacoes() {
            configurarRelacionamentos();
            when(avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc())
                    .thenReturn(List.of(avaliacao));

            List<AvaliacaoResponseDTO> resposta = avaliacaoService.listarTodas();

            assertThat(resposta).hasSize(1);
            assertThat(resposta.get(0).getId()).isEqualTo(avaliacaoId);
            assertThat(resposta.get(0).getAlunoNome()).isEqualTo("Maria da Silva");
            verify(avaliacaoRepository).findAllByOrderByDataAvaliacaoDesc();
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando não houver avaliações")
        void deveRetornarListaVazia() {
            when(avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc())
                    .thenReturn(List.of());

            assertThat(avaliacaoService.listarTodas()).isEmpty();
        }

        @Test
        @DisplayName("Deve usar valores alternativos quando não houver turma ou nomes relacionados")
        void deveTratarRelacionamentosAusentes() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());
            when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.empty());
            when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId))
                    .thenReturn(List.of());
            when(avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc())
                    .thenReturn(List.of(avaliacao));

            List<AvaliacaoResponseDTO> resposta = avaliacaoService.listarTodas();

            assertThat(resposta).hasSize(1);
            assertThat(resposta.get(0).getAlunoNome()).isNull();
            assertThat(resposta.get(0).getProfessorNome()).isNull();
            assertThat(resposta.get(0).getTurmaNomeCompleto()).isEqualTo("Sem Turma Ativa");
        }
    }

    @Nested
    @DisplayName("buscarPorId")
    class BuscarPorId {

        @Test
        @DisplayName("Deve buscar avaliação pelo ID")
        void deveBuscarPorId() {
            configurarRelacionamentos();
            when(avaliacaoRepository.findById(avaliacaoId)).thenReturn(Optional.of(avaliacao));

            AvaliacaoResponseDTO resposta = avaliacaoService.buscarPorId(avaliacaoId);

            assertThat(resposta.getId()).isEqualTo(avaliacaoId);
            assertThat(resposta.getDescricao()).isEqualTo("Avaliação pedagógica");
        }

        @Test
        @DisplayName("Deve lançar exceção quando a avaliação não existe")
        void deveFalharQuandoAvaliacaoNaoExiste() {
            when(avaliacaoRepository.findById(avaliacaoId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.buscarPorId(avaliacaoId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Avaliação não encontrada");
        }
    }

    @Nested
    @DisplayName("listarPorAluno")
    class ListarPorAluno {

        @Test
        @DisplayName("Deve listar avaliações de um aluno")
        void deveListarPorAluno() {
            configurarRelacionamentos();
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(alunoId))
                    .thenReturn(List.of(avaliacao));

            List<AvaliacaoResponseDTO> resposta = avaliacaoService.listarPorAluno(alunoId);

            assertThat(resposta).hasSize(1);
            assertThat(resposta.get(0).getAlunoId()).isEqualTo(alunoId);
            verify(avaliacaoRepository).findByPacienteIdOrderByDataAvaliacaoDesc(alunoId);
        }

        @Test
        @DisplayName("Deve lançar exceção quando o aluno não existe")
        void deveFalharQuandoAlunoNaoExiste() {
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.listarPorAluno(alunoId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Aluno não encontrado");

            verify(avaliacaoRepository, never())
                    .findByPacienteIdOrderByDataAvaliacaoDesc(any());
        }
    }

    @Nested
    @DisplayName("listarPorProfessor")
    class ListarPorProfessor {

        @Test
        @DisplayName("Deve listar avaliações de um professor")
        void deveListarPorProfessor() {
            configurarRelacionamentos();
            when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
            when(avaliacaoRepository.findByProfessorOrderByDataAvaliacaoDesc(professor))
                    .thenReturn(List.of(avaliacao));

            List<AvaliacaoResponseDTO> resposta = avaliacaoService.listarPorProfessor(professorId);

            assertThat(resposta).hasSize(1);
            assertThat(resposta.get(0).getProfessorId()).isEqualTo(professorId);
            verify(avaliacaoRepository).findByProfessorOrderByDataAvaliacaoDesc(professor);
        }

        @Test
        @DisplayName("Deve lançar exceção quando o professor não existe")
        void deveFalharQuandoProfessorNaoExiste() {
            when(professorRepository.findById(professorId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.listarPorProfessor(professorId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Professor não encontrado");

            verify(avaliacaoRepository, never())
                    .findByProfessorOrderByDataAvaliacaoDesc(any());
        }
    }

    @Nested
    @DisplayName("atualizar")
    class Atualizar {

        @Test
        @DisplayName("Deve atualizar avaliação existente")
        void deveAtualizarAvaliacao() {
            configurarRelacionamentos();
            configurarSave();
            when(avaliacaoRepository.findById(avaliacaoId)).thenReturn(Optional.of(avaliacao));
            when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));

            AvaliacaoRequestDTO novoRequest = AvaliacaoRequestDTO.builder()
                    .descricao("Avaliação atualizada")
                    .alunoId(alunoId)
                    .professorId(professorId)
                    .build();

            AvaliacaoResponseDTO resposta = avaliacaoService.atualizar(avaliacaoId, novoRequest);

            assertThat(resposta.getId()).isEqualTo(avaliacaoId);
            assertThat(resposta.getDescricao()).isEqualTo("Avaliação atualizada");
            assertThat(avaliacao.getDescricao()).isEqualTo("Avaliação atualizada");
            verify(avaliacaoRepository).save(avaliacao);
        }

        @Test
        @DisplayName("Deve lançar exceção quando a avaliação não existe")
        void deveFalharQuandoAvaliacaoNaoExiste() {
            when(avaliacaoRepository.findById(avaliacaoId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.atualizar(avaliacaoId, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Avaliação não encontrada");

            verify(avaliacaoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar exceção quando o aluno informado não existe")
        void deveFalharQuandoAlunoNaoExiste() {
            when(avaliacaoRepository.findById(avaliacaoId)).thenReturn(Optional.of(avaliacao));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.atualizar(avaliacaoId, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Aluno não encontrado");

            verify(avaliacaoRepository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar exceção quando o professor informado não existe")
        void deveFalharQuandoProfessorNaoExiste() {
            when(avaliacaoRepository.findById(avaliacaoId)).thenReturn(Optional.of(avaliacao));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(professorRepository.findById(professorId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> avaliacaoService.atualizar(avaliacaoId, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Professor não encontrado");

            verify(avaliacaoRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("deletar")
    class Deletar {

        @Test
        @DisplayName("Deve excluir avaliação existente")
        void deveDeletarAvaliacao() {
            when(avaliacaoRepository.existsById(avaliacaoId)).thenReturn(true);

            avaliacaoService.deletar(avaliacaoId);

            verify(avaliacaoRepository).deleteById(avaliacaoId);
        }

        @Test
        @DisplayName("Deve lançar exceção quando a avaliação não existe")
        void deveFalharQuandoAvaliacaoNaoExiste() {
            when(avaliacaoRepository.existsById(avaliacaoId)).thenReturn(false);

            assertThatThrownBy(() -> avaliacaoService.deletar(avaliacaoId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Avaliação não encontrada");

            verify(avaliacaoRepository, never()).deleteById(any());
        }
    }
}
