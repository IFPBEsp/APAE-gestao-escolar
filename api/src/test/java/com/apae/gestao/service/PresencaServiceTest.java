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
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

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

        aluno = criarAluno(alunoId, "Aluno de Teste");
        vinculo = criarVinculo(alunoId);
    }

    private AlunoView criarAluno(UUID id, String nome) {
        return new AlunoView(
                id,
                nome,
                "111.222.333-44",
                LocalDate.of(2015, 8, 15),
                "(83) 99999-0000",
                null,
                true,
                false
        );
    }

    private TurmaAluno criarVinculo(UUID pacienteId) {
        TurmaAluno novoVinculo = new TurmaAluno();
        novoVinculo.setId(UUID.randomUUID());
        novoVinculo.setTurma(turma);
        novoVinculo.setPacienteId(pacienteId);
        novoVinculo.setAtivo(true);
        return novoVinculo;
    }

    private Presenca criarPresenca(UUID id, UUID pacienteId, boolean faltou) {
        return Presenca.builder()
                .id(id)
                .aula(aula)
                .pacienteId(pacienteId)
                .faltou(faltou)
                .build();
    }

    private RegistrarChamadaRequestDTO.PresencaItemDTO criarItem(
            UUID pacienteId, PresencaAlunoDTO.StatusPresenca status) {
        return RegistrarChamadaRequestDTO.PresencaItemDTO.builder()
                .alunoId(pacienteId)
                .status(status)
                .build();
    }

    @Nested
    @DisplayName("getChamadaPorTurmaEData")
    class GetChamadaPorTurmaEData {

        @Test
        @DisplayName("Sem aula: todos os alunos ativos presentes, sem presencaId e sem descrição")
        void deveRetornarTodosPresentesQuandoAulaNaoExiste() {
            UUID outroAlunoId = UUID.randomUUID();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.empty());
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo, criarVinculo(outroAlunoId)));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(alunoRepository.findById(outroAlunoId))
                    .thenReturn(Optional.of(criarAluno(outroAlunoId, "Outro Aluno")));

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getDescricao()).isNull();
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(2);
            assertThat(resultado.getTotalPresentes()).isEqualTo(2);
            assertThat(resultado.getListaPresencas())
                    .extracting(PresencaAlunoDTO::getAlunoId)
                    .containsExactly(alunoId, outroAlunoId);
            assertThat(resultado.getListaPresencas())
                    .extracting(PresencaAlunoDTO::getPresencaId)
                    .containsOnlyNulls();
            assertThat(resultado.getListaPresencas())
                    .extracting(PresencaAlunoDTO::getStatus)
                    .containsExactly(
                            PresencaAlunoDTO.StatusPresenca.PRESENTE,
                            PresencaAlunoDTO.StatusPresenca.PRESENTE);

            verify(presencaRepository, never()).findByAula(any());
        }

        @Test
        @DisplayName("Com aula: aluno com faltou = true é mapeado como FALTA")
        void deveMapearAlunoFaltosoComoFalta() {
            Presenca presenca = criarPresenca(presencaId, alunoId, true);

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
        @DisplayName("Com aula: aluno com faltou = false é mapeado como PRESENTE")
        void deveMapearAlunoPresenteComoPresente() {
            Presenca presenca = criarPresenca(presencaId, alunoId, false);

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(presencaRepository.findByAula(aula)).thenReturn(List.of(presenca));
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getDescricao()).isEqualTo("Aula de teste");
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getTotalPresentes()).isEqualTo(1);
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.PRESENTE);
            assertThat(resultado.getListaPresencas().get(0).getPresencaId())
                    .isEqualTo(presencaId);
        }

        @Test
        @DisplayName("Com aula: aluno sem registro de presença é mapeado como PRESENTE")
        void deveMapearAlunoSemRegistroComoPresente() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(presencaRepository.findByAula(aula)).thenReturn(List.of());
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getDescricao()).isEqualTo("Aula de teste");
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getTotalPresentes()).isEqualTo(1);
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.PRESENTE);
            assertThat(resultado.getListaPresencas().get(0).getPresencaId()).isNull();
        }

        @Test
        @DisplayName("Deve calcular os totais com alunos faltoso, presente e sem registro")
        void deveCalcularTotaisComAlunosVariados() {
            UUID presenteId = UUID.randomUUID();
            UUID semRegistroId = UUID.randomUUID();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(presencaRepository.findByAula(aula)).thenReturn(List.of(
                    criarPresenca(UUID.randomUUID(), alunoId, true),
                    criarPresenca(UUID.randomUUID(), presenteId, false)));
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(
                            vinculo,
                            criarVinculo(presenteId),
                            criarVinculo(semRegistroId)));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(alunoRepository.findById(presenteId))
                    .thenReturn(Optional.of(criarAluno(presenteId, "Aluno Presente")));
            when(alunoRepository.findById(semRegistroId))
                    .thenReturn(Optional.of(criarAluno(semRegistroId, "Aluno Sem Registro")));

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(3);
            assertThat(resultado.getTotalPresentes()).isEqualTo(2);
            assertThat(resultado.getListaPresencas())
                    .extracting(PresencaAlunoDTO::getStatus)
                    .containsExactly(
                            PresencaAlunoDTO.StatusPresenca.FALTA,
                            PresencaAlunoDTO.StatusPresenca.PRESENTE,
                            PresencaAlunoDTO.StatusPresenca.PRESENTE);
        }

        @Test
        @DisplayName("Aluno ausente da view: alunoNome fica nulo sem interromper a chamada")
        void deveRetornarAlunoNomeNuloQuandoAlunoNaoExisteNaView() {
            Presenca presenca = criarPresenca(presencaId, alunoId, true);

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(presencaRepository.findByAula(aula)).thenReturn(List.of(presenca));
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.empty());

            ChamadaResponseDTO resultado =
                    presencaService.getChamadaPorTurmaEData(turmaId, data);

            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getListaPresencas()).hasSize(1);
            assertThat(resultado.getListaPresencas().get(0).getAlunoId()).isEqualTo(alunoId);
            assertThat(resultado.getListaPresencas().get(0).getAlunoNome()).isNull();
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.FALTA);
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

        private RegistrarChamadaRequestDTO requestSemPresencas(String descricao) {
            return RegistrarChamadaRequestDTO.builder()
                    .descricao(descricao)
                    .presencas(List.of())
                    .build();
        }

        private void verificarRejeicaoNoFimDeSemana(LocalDate diaNaoLetivo) {
            RegistrarChamadaRequestDTO request = requestSemPresencas(null);

            assertThatThrownBy(
                    () -> presencaService.registrarChamada(turmaId, diaNaoLetivo, request))
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(ex -> {
                        ResponseStatusException erro = (ResponseStatusException) ex;
                        assertThat(erro.getStatusCode())
                                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
                    });

            verifyNoInteractions(turmaRepository, aulaRepository, presencaRepository,
                    alunoRepository, turmaAlunoRepository);
        }

        @Test
        @DisplayName("Deve criar aula com a descrição informada, salvá-la uma única vez e registrar falta")
        void deveCriarAulaERegistrarFalta() {
            RegistrarChamadaRequestDTO request = RegistrarChamadaRequestDTO.builder()
                    .descricao("Chamada de teste")
                    .presencas(List.of(criarItem(alunoId, PresencaAlunoDTO.StatusPresenca.FALTA)))
                    .build();

            AtomicReference<Aula> aulaCriada = new AtomicReference<>();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
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
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(presencaRepository.findByAulaAndPacienteId(any(Aula.class), eq(alunoId)))
                    .thenReturn(Optional.empty());
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(presencaRepository.findByAula(any(Aula.class)))
                    .thenReturn(List.of(criarPresenca(presencaId, alunoId, true)));

            ChamadaResponseDTO resultado =
                    presencaService.registrarChamada(turmaId, data, request);

            assertThat(resultado.getTurmaId()).isEqualTo(turmaId);
            assertThat(resultado.getDataChamada()).isEqualTo(data);
            assertThat(resultado.getDescricao()).isEqualTo("Chamada de teste");
            assertThat(resultado.getTotalAlunosNaTurma()).isEqualTo(1);
            assertThat(resultado.getTotalPresentes()).isZero();
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.FALTA);

            ArgumentCaptor<Aula> aulaCaptor = ArgumentCaptor.forClass(Aula.class);
            verify(aulaRepository, times(1)).save(aulaCaptor.capture());
            assertThat(aulaCaptor.getValue().getDescricao()).isEqualTo("Chamada de teste");
            assertThat(aulaCaptor.getValue().getTurma()).isEqualTo(turma);
            assertThat(aulaCaptor.getValue().getData()).isEqualTo(data);

            ArgumentCaptor<Presenca> presencaCaptor = ArgumentCaptor.forClass(Presenca.class);
            verify(presencaRepository).save(presencaCaptor.capture());
            assertThat(presencaCaptor.getValue().getPacienteId()).isEqualTo(alunoId);
            assertThat(presencaCaptor.getValue().getFaltou()).isTrue();
            assertThat(presencaCaptor.getValue().getAula()).isSameAs(aulaCriada.get());
        }

        @Test
        @DisplayName("Deve criar presença nova com PRESENTE resultando em faltou = false")
        void deveCriarPresencaNovaComStatusPresente() {
            RegistrarChamadaRequestDTO request = RegistrarChamadaRequestDTO.builder()
                    .presencas(List.of(criarItem(alunoId, PresencaAlunoDTO.StatusPresenca.PRESENTE)))
                    .build();

            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));
            when(alunoRepository.findById(alunoId)).thenReturn(Optional.of(aluno));
            when(presencaRepository.findByAulaAndPacienteId(aula, alunoId))
                    .thenReturn(Optional.empty());
            when(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true))
                    .thenReturn(List.of(vinculo));
            when(presencaRepository.findByAula(aula)).thenReturn(List.of());

            ChamadaResponseDTO resultado =
                    presencaService.registrarChamada(turmaId, data, request);

            ArgumentCaptor<Presenca> presencaCaptor = ArgumentCaptor.forClass(Presenca.class);
            verify(presencaRepository).save(presencaCaptor.capture());
            assertThat(presencaCaptor.getValue().getPacienteId()).isEqualTo(alunoId);
            assertThat(presencaCaptor.getValue().getAula()).isSameAs(aula);
            assertThat(presencaCaptor.getValue().getFaltou()).isFalse();

            assertThat(resultado.getTotalPresentes()).isEqualTo(1);
            verify(aulaRepository, never()).save(any(Aula.class));
        }

        @Test
        @DisplayName("Deve atualizar a presença existente para FALTA (faltou = true)")
        void deveAtualizarPresencaExistenteParaFalta() {
            RegistrarChamadaRequestDTO request = RegistrarChamadaRequestDTO.builder()
                    .presencas(List.of(criarItem(alunoId, PresencaAlunoDTO.StatusPresenca.FALTA)))
                    .build();

            Presenca presencaExistente = criarPresenca(presencaId, alunoId, false);

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

            ChamadaResponseDTO resultado =
                    presencaService.registrarChamada(turmaId, data, request);

            assertThat(presencaExistente.getFaltou()).isTrue();
            verify(presencaRepository).save(presencaExistente);
            verify(aulaRepository, never()).save(any(Aula.class));

            assertThat(resultado.getTurmaId()).isEqualTo(turmaId);
            assertThat(resultado.getDataChamada()).isEqualTo(data);
            assertThat(resultado.getTotalPresentes()).isZero();
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.FALTA);
        }

        @Test
        @DisplayName("Deve atualizar a presença existente para PRESENTE (faltou = false)")
        void deveAtualizarPresencaExistenteParaPresente() {
            RegistrarChamadaRequestDTO request = RegistrarChamadaRequestDTO.builder()
                    .presencas(List.of(criarItem(alunoId, PresencaAlunoDTO.StatusPresenca.PRESENTE)))
                    .build();

            Presenca presencaExistente = criarPresenca(presencaId, alunoId, true);

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

            ChamadaResponseDTO resultado =
                    presencaService.registrarChamada(turmaId, data, request);

            assertThat(presencaExistente.getFaltou()).isFalse();
            verify(presencaRepository).save(presencaExistente);
            verify(aulaRepository, never()).save(any(Aula.class));

            assertThat(resultado.getTotalPresentes()).isEqualTo(1);
            assertThat(resultado.getListaPresencas().get(0).getStatus())
                    .isEqualTo(PresencaAlunoDTO.StatusPresenca.PRESENTE);
        }

        @Test
        @DisplayName("Aula existente: descrição preenchida é atualizada e a aula é salva")
        void deveAtualizarDescricaoDaAulaExistenteQuandoPreenchida() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));

            presencaService.registrarChamada(turmaId, data, requestSemPresencas("Nova descrição"));

            assertThat(aula.getDescricao()).isEqualTo("Nova descrição");
            verify(aulaRepository, times(1)).save(aula);
        }

        @Test
        @DisplayName("Aula existente: descrição nula não altera a aula nem a salva")
        void deveManterDescricaoDaAulaExistenteQuandoNula() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));

            presencaService.registrarChamada(turmaId, data, requestSemPresencas(null));

            assertThat(aula.getDescricao()).isEqualTo("Aula de teste");
            verify(aulaRepository, never()).save(any(Aula.class));
        }

        @Test
        @DisplayName("Aula existente: descrição em branco não altera a aula nem a salva")
        void deveManterDescricaoDaAulaExistenteQuandoEmBranco() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
            when(aulaRepository.findByTurmaAndData(turma, data))
                    .thenReturn(Optional.of(aula));

            presencaService.registrarChamada(turmaId, data, requestSemPresencas("   "));

            assertThat(aula.getDescricao()).isEqualTo("Aula de teste");
            verify(aulaRepository, never()).save(any(Aula.class));
        }

        @Test
        @DisplayName("Deve rejeitar registro de chamada no sábado")
        void deveRejeitarChamadaNoSabado() {
            verificarRejeicaoNoFimDeSemana(LocalDate.of(2026, 10, 24));
        }

        @Test
        @DisplayName("Deve rejeitar registro de chamada no domingo")
        void deveRejeitarChamadaNoDomingo() {
            verificarRejeicaoNoFimDeSemana(LocalDate.of(2026, 10, 25));
        }

        @Test
        @DisplayName("Deve lançar exceção quando a turma não existe e não salvar nada")
        void deveLancarExcecaoQuandoTurmaNaoExiste() {
            when(turmaRepository.findById(turmaId)).thenReturn(Optional.empty());

            assertThatThrownBy(
                    () -> presencaService.registrarChamada(turmaId, data, requestSemPresencas(null)))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Turma não encontrada");

            verify(aulaRepository, never()).save(any(Aula.class));
            verify(presencaRepository, never()).save(any(Presenca.class));
        }

        @Test
        @DisplayName("Deve lançar exceção quando o aluno não existe e não salvar presença")
        void deveLancarExcecaoQuandoAlunoNaoExiste() {
            RegistrarChamadaRequestDTO request = RegistrarChamadaRequestDTO.builder()
                    .presencas(List.of(criarItem(alunoId, PresencaAlunoDTO.StatusPresenca.PRESENTE)))
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
            verify(aulaRepository, never()).save(any(Aula.class));
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
