
package com.apae.gestao.service;

import com.apae.gestao.dto.aula.chamada.ChamadaResponseDTO;
import com.apae.gestao.dto.aula.chamada.PresencaAlunoDTO;
import com.apae.gestao.dto.aula.chamada.RegistrarChamadaRequestDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AulaRepository;
import com.apae.gestao.repository.PresencaRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PresencaService - Testes Unitários")
class PresencaServiceTest {

    @Mock
    private PresencaRepository presencaRepository;

    @Mock
    private AulaRepository aulaRepository;

    @Mock
    private TurmaRepository turmaRepository;

    @Mock
    private AlunoViewRepository alunoRepository;

    @Mock
    private TurmaAlunoRepository turmaAlunoRepository;

    @InjectMocks
    private PresencaService presencaService;

    private UUID turmaId;
    private UUID alunoId;
    private UUID presencaId;
    private LocalDate data;
    private Turma turma;
    private Aula aula;
    private AlunoView aluno;
    private TurmaAluno vinculo;

    @BeforeEach
    void setUp() {
        turmaId = UUID.randomUUID();
        alunoId = UUID.randomUUID();
        presencaId = UUID.randomUUID();
        data = LocalDate.of(2026, 10, 19);

        turma = new Turma();
        turma.setId(turmaId);
        turma.setNome("Turma de Teste");

        aula = Aula.builder()
                .id(UUID.randomUUID())
                .turma(turma)
                .data(data)
                .descricao("Aula de teste")
                .build();

        aluno = new AlunoView(
        alunoId,
        "Aluno de Teste",
        "111.222.333-44",
        LocalDate.of(2015, 8, 15),
        "(83) 99999-0000",
        null,
        true,
        false
);

        vinculo = new TurmaAluno();
        vinculo.setId(UUID.randomUUID());
        vinculo.setTurma(turma);
        vinculo.setPacienteId(alunoId);
        vinculo.setAtivo(true);
    }

    @Nested
    @DisplayName("getChamadaPorTurmaEData")
    class GetChamadaPorTurmaEData {

        @Test
        @DisplayName("Deve retornar a chamada com alunos presentes e faltosos")
        void deveRetornarChamadaComPresentesEFaltosos() {
            Presenca presenca = Presenca.builder()
                    .id(presencaId)
                    .aula(aula)
                    .pacienteId(alunoId)
                    .faltou(true)
                    .build();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(presencaRepository.findByAula(aula)).thenReturn(List.of(presenca));
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getTurmaId()).isEqualTo(turmaId);
            assertThat(resultado.getTurmaNome()).isEqualTo("Turma de Teste");
            assertThat(resultado.getDataChamada()).isEqualTo(data);
            assertThat(resultado.getDescricao()).isEqualTo("Aula de teste");
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getTotalPresentes()).isZero();
            assertThat(resultado.getListaPresencas()).hasSize(1);
            assertThat(resultado.getListaPresencas().get(0).getAlunoNome())
                    .isEqualTo("Aluno de Teste");
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.FALTA);
            assertThat(resultado.getListaPresencas().get(0).getPresencaId())
                    .isEqualTo(presencaId);
        }

        @Test
        @DisplayName("Deve considerar os alunos presentes quando ainda não existe aula")
        void deveRetornarAlunosPresentesQuandoAulaNaoExiste() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.empty());
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getDescricao()).isNull();
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getTotalPresentes()).isEqualTo(1);
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.PRESENTE);

            verify(presencaRepository, never()).findByAula(any());
        }

        @Test
        @DisplayName("Deve lançar exceção quando a turma não existe")
        void deveLancarExcecaoQuandoTurmaNaoExiste() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.empty());

            assertThatThrownBy(
                    () -> presencaService.getChamadaPorTurmaEData(turmaId, data))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Turma não encontrada");
        }
    }

    @Nested
    @DisplayName("registrarChamada")
    class RegistrarChamada {

        @Test
        @DisplayName("Deve criar aula e registrar falta do aluno")
        void deveCriarAulaERegistrarFalta() {
            RegistrarChamadaRequestDTO.PresencaItemDTO item =
                    RegistrarChamadaRequestDTO.PresencaItemDTO.builder()
                            .alunoId(alunoId)
                            .status(PresencaAlunoDTO.StatusPresenca.FALTA)
                            .build();

            RegistrarChamadaRequestDTO request =
                    RegistrarChamadaRequestDTO.builder()
                            .descricao("Chamada de teste")
                            .presencas(List.of(item))
                            .build();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            AtomicReference<Aula> aulaCriada = new AtomicReference<>();
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenAnswer(invocation -> Optional.ofNullable(aulaCriada.get()));
            when(aulaRepository.save(any(Aula.class))).thenAnswer(invocation -> {
                Aula aulaSalva = invocation.getArgument(0);
                if (aulaSalva.getId() == null) {
                    aulaSalva.setId(UUID.randomUUID());
                }
                aulaCriada.set(aulaSalva);
                return aulaSalva;
            });
            when(presencaRepository.findByAulaAndPacienteId(any(Aula.class), eq(alunoId)))
                    .thenReturn(Optional.empty());
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(presencaRepository.findByAula(any(Aula.class)))
                    .thenAnswer(invocation -> {
                        Aula aulaConsultada = invocation.getArgument(0);
                        Presenca registro = Presenca.builder()
                                .id(presencaId)
                                .aula(aulaConsultada)
                                .pacienteId(alunoId)
                                .faltou(true)
                                .build();
                        return List.of(registro);
                    });

            ChamadaResponseDTO resultado =
                    presencaService.registrarChamada(turmaId, data, request);

            assertThat(resultado.getDescricao()).isEqualTo("Chamada de teste");
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getTotalPresentes()).isZero();

            verify(aulaRepository, times(2)).save(any(Aula.class));
            verify(presencaRepository).save(argThat(p ->
                    p.getPacienteId().equals(alunoId)
                            && Boolean.TRUE.equals(p.getFaltou())));
        }

        @Test
        @DisplayName("Deve atualizar a presença existente do aluno")
        void deveAtualizarPresencaExistente() {
            RegistrarChamadaRequestDTO.PresencaItemDTO item =
                    RegistrarChamadaRequestDTO.PresencaItemDTO.builder()
                            .alunoId(alunoId)
                            .status(PresencaAlunoDTO.StatusPresenca.FALTA)
                            .build();

            RegistrarChamadaRequestDTO request =
                    RegistrarChamadaRequestDTO.builder()
                            .presencas(List.of(item))
                            .build();

            Presenca presencaExistente = Presenca.builder()
                    .id(presencaId)
                    .aula(aula)
                    .pacienteId(alunoId)
                    .faltou(false)
                    .build();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(presencaRepository.findByAulaAndPacienteId(aula, alunoId))
                    .thenReturn(Optional.of(presencaExistente));
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(presencaRepository.findByAula(aula))
                    .thenReturn(List.of(presencaExistente));

            presencaService.registrarChamada(turmaId, data, request);

            assertThat(presencaExistente.getFaltou()).isTrue();
            verify(presencaRepository).save(presencaExistente);
            verify(aulaRepository, never()).save(any(Aula.class));
        }

        @Test
        @DisplayName("Deve rejeitar registro de chamada no fim de semana")
        void deveRejeitarChamadaNoFimDeSemana() {
            LocalDate sabado = LocalDate.of(2026, 10, 24);
            RegistrarChamadaRequestDTO request =
                    RegistrarChamadaRequestDTO.builder()
                            .presencas(List.of())
                            .build();

            assertThatThrownBy(
                    () -> presencaService.registrarChamada(turmaId, sabado, request))
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(ex -> {
                        ResponseStatusException erro = (ResponseStatusException) ex;
                        assertThat(erro.getStatusCode())
                                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
                    });

            verifyNoInteractions(turmaRepository, aulaRepository, presencaRepository);
        }

        @Test
        @DisplayName("Deve lançar exceção quando a turma não existe")
        void deveLancarExcecaoQuandoTurmaNaoExiste() {
            RegistrarChamadaRequestDTO request =
                    RegistrarChamadaRequestDTO.builder()
                            .presencas(List.of())
                            .build();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.empty());

            assertThatThrownBy(
                    () -> presencaService.registrarChamada(turmaId, data, request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Turma não encontrada");
        }

        @Test
        @DisplayName("Deve lançar exceção quando o aluno não existe")
        void deveLancarExcecaoQuandoAlunoNaoExiste() {
            RegistrarChamadaRequestDTO.PresencaItemDTO item =
                    RegistrarChamadaRequestDTO.PresencaItemDTO.builder()
                            .alunoId(alunoId)
                            .status(PresencaAlunoDTO.StatusPresenca.PRESENTE)
                            .build();

            RegistrarChamadaRequestDTO request =
                    RegistrarChamadaRequestDTO.builder()
                            .presencas(List.of(item))
                            .build();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            assertThatThrownBy(
                    () -> presencaService.registrarChamada(turmaId, data, request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Aluno não encontrado");

            verify(presencaRepository, never()).save(any(Presenca.class));
        }
    }

    @Nested
    @DisplayName("deletar")
    class Deletar {

        @Test
        @DisplayName("Deve excluir a presença quando ela existe")
        void deveExcluirPresencaExistente() {
            when(presencaRepository.existsById(presencaId)).thenReturn(true);

            presencaService.deletar(presencaId);

            verify(presencaRepository).deleteById(presencaId);
        }

        @Test
        @DisplayName("Deve lançar exceção quando a presença não existe")
        void deveLancarExcecaoQuandoPresencaNaoExiste() {
            when(presencaRepository.existsById(presencaId)).thenReturn(false);

            assertThatThrownBy(() -> presencaService.deletar(presencaId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Presença não encontrada");

            verify(presencaRepository, never()).deleteById(any());
        }
    }
}
