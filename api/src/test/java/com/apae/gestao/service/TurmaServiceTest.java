package com.apae.gestao.service;

import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TurmaServiceTest {

    @Mock
    private TurmaRepository turmaRepository;

    @Mock
    private AlunoViewRepository alunoRepository;

    @Mock
    private TurmaAlunoRepository turmaAlunoRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private TurmaService turmaService;

    private UUID turmaId;
    private UUID pacienteId;
    private Turma turma;
    private TurmaRequestDTO turmaRequestDTO;

    @BeforeEach
    void setUp() {
        turmaId = UUID.randomUUID();
        pacienteId = UUID.randomUUID();

        turma = new Turma();
        turma.setId(turmaId);
        turma.setNome("Artes Manha - 2024");
        turma.setAnoCriacao(2024);
        turma.setTurno("MANHA");
        turma.setTipo("Artes");
        turma.setAtiva(true);
        turma.setTurmaAlunos(new HashSet<>());

        turmaRequestDTO = new TurmaRequestDTO();
        turmaRequestDTO.setAnoCriacao(2024);
        turmaRequestDTO.setTurno("MANHA");
        turmaRequestDTO.setTipo("Artes");
        turmaRequestDTO.setAtiva(true);
        turmaRequestDTO.setAlunosIds(new HashSet<>());
    }

    @Test
    void criar_DeveCriarComNomeBaseQuandoNomeNaoExiste() {
        when(turmaRepository.existsByNome("Artes Manha - 2024")).thenReturn(false);

        when(turmaRepository.save(any(Turma.class))).thenAnswer(invocation -> {
            Turma t = invocation.getArgument(0);
            t.setId(turmaId);
            return t;
        });

        Turma turmaSalva = new Turma();
        turmaSalva.setId(turmaId);
        turmaSalva.setNome("Artes Manha - 2024");
        turmaSalva.setTurno("MANHA");
        turmaSalva.setTipo("Artes");
        turmaSalva.setAnoCriacao(2024);
        turmaSalva.setAtiva(true);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turmaSalva));

        TurmaResponseDTO response = turmaService.criar(turmaRequestDTO);

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(2)).save(captor.capture());
        assertEquals("Artes Manha - 2024", captor.getAllValues().get(0).getNome());
        assertEquals("Artes Manha - 2024", response.getNome());
        assertEquals("Segunda a Sexta - 8h as 12h", response.getHorario());
    }

    @Test
    void criar_DeveGerarNomeIncrementalQuandoNomeJaExiste() {
        when(turmaRepository.existsByNome("Artes Manha - 2024")).thenReturn(true);
        when(turmaRepository.existsByNome("Artes Manha - 2024 (2)")).thenReturn(false);

        when(turmaRepository.save(any(Turma.class))).thenAnswer(invocation -> {
            Turma t = invocation.getArgument(0);
            t.setId(turmaId);
            return t;
        });

        Turma turmaSalva = new Turma();
        turmaSalva.setId(turmaId);
        turmaSalva.setNome("Artes Manha - 2024 (2)");
        turmaSalva.setTurno("MANHA");
        turmaSalva.setTipo("Artes");
        turmaSalva.setAnoCriacao(2024);
        turmaSalva.setAtiva(true);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turmaSalva));

        TurmaResponseDTO response = turmaService.criar(turmaRequestDTO);

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(2)).save(captor.capture());
        assertEquals("Artes Manha - 2024 (2)", captor.getAllValues().get(0).getNome());
        assertEquals("Artes Manha - 2024 (2)", response.getNome());
        assertEquals("Segunda a Sexta - 8h as 12h", response.getHorario());
    }

    @Test
    void criar_DeveGerarNomeSufixo3QuandoSufixo2TambemExiste() {
        when(turmaRepository.existsByNome("Artes Manha - 2024")).thenReturn(true);
        when(turmaRepository.existsByNome("Artes Manha - 2024 (2)")).thenReturn(true);
        when(turmaRepository.existsByNome("Artes Manha - 2024 (3)")).thenReturn(false);

        when(turmaRepository.save(any(Turma.class))).thenAnswer(invocation -> {
            Turma t = invocation.getArgument(0);
            t.setId(turmaId);
            return t;
        });

        Turma turmaSalva = new Turma();
        turmaSalva.setId(turmaId);
        turmaSalva.setNome("Artes Manha - 2024 (3)");
        turmaSalva.setTurno("MANHA");
        turmaSalva.setTipo("Artes");
        turmaSalva.setAnoCriacao(2024);
        turmaSalva.setAtiva(true);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turmaSalva));

        TurmaResponseDTO response = turmaService.criar(turmaRequestDTO);

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(2)).save(captor.capture());
        assertEquals("Artes Manha - 2024 (3)", captor.getAllValues().get(0).getNome());
        assertEquals("Artes Manha - 2024 (3)", response.getNome());
    }

    @Test
    void criar_DeveDeduzirHorarioPorTurnoTarde() {
        turmaRequestDTO.setTurno("TARDE");
        turmaRequestDTO.setAlunosIds(new HashSet<>());

        when(turmaRepository.existsByNome("Artes Tarde - 2024")).thenReturn(false);

        when(turmaRepository.save(any(Turma.class))).thenAnswer(invocation -> {
            Turma t = invocation.getArgument(0);
            t.setId(turmaId);
            return t;
        });

        Turma turmaSalva = new Turma();
        turmaSalva.setId(turmaId);
        turmaSalva.setNome("Artes Tarde - 2024");
        turmaSalva.setTurno("TARDE");
        turmaSalva.setTipo("Artes");
        turmaSalva.setAnoCriacao(2024);
        turmaSalva.setAtiva(true);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turmaSalva));

        TurmaResponseDTO response = turmaService.criar(turmaRequestDTO);

        assertEquals("Segunda a Sexta - 14h as 18h", response.getHorario());
    }

    @Test
    void atualizar_DeveAtualizarCamposEManterNomeQuandoNaoHaColisao() {
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaRepository.existsByNomeAndIdNot("Artes Manha - 2024", turmaId)).thenReturn(false);
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        TurmaResponseDTO response = turmaService.atualizar(turmaId, turmaRequestDTO);

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(2)).save(captor.capture());
        Turma capturada = captor.getAllValues().get(0);
        assertEquals("Artes Manha - 2024", capturada.getNome());
        assertEquals(2024, capturada.getAnoCriacao());
        assertEquals("MANHA", capturada.getTurno());
        assertEquals("Artes", capturada.getTipo());
        assertEquals("Artes Manha - 2024", response.getNome());
    }

    @Test
    void atualizar_DeveGerarNomeIncrementalQuandoNomeColideComOutraTurma() {
        turma.setNome("Artes Manha - 2024");
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaRepository.existsByNomeAndIdNot("Artes Manha - 2024", turmaId)).thenReturn(true);
        when(turmaRepository.existsByNomeAndIdNot("Artes Manha - 2024 (2)", turmaId)).thenReturn(false);
        when(turmaRepository.save(any(Turma.class))).thenAnswer(invocation -> {
            Turma t = invocation.getArgument(0);
            t.setNome("Artes Manha - 2024 (2)");
            return t;
        });

        TurmaResponseDTO response = turmaService.atualizar(turmaId, turmaRequestDTO);

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(2)).save(captor.capture());
        assertEquals("Artes Manha - 2024 (2)", captor.getAllValues().get(0).getNome());
        assertEquals("Artes Manha - 2024 (2)", response.getNome());
    }

    @Test
    void adicionarAlunos_DeveVincularAlunoNovoNaTurma() {
        AlunoView alunoMock = new AlunoView(pacienteId, "Joao", "123", LocalDate.now(), "11999", UUID.randomUUID(), true, false);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(alunoRepository.findAllById(anyList())).thenReturn(List.of(alunoMock));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(Collections.emptyList());
        when(turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId)).thenReturn(Optional.empty());
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        turmaService.adicionarAlunos(turmaId, List.of(pacienteId));

        assertEquals(1, turma.getTurmaAlunos().size());
        TurmaAluno vinculo = turma.getTurmaAlunos().iterator().next();
        assertEquals(pacienteId, vinculo.getPacienteId());
        assertTrue(vinculo.getAtivo());
        verify(turmaRepository, times(1)).save(turma);
    }

    @Test
    void adicionarAlunos_DeveReativarVinculoExistenteInativo() {
        TurmaAluno vinculoExistente = new TurmaAluno();
        vinculoExistente.setTurma(turma);
        vinculoExistente.setPacienteId(pacienteId);
        vinculoExistente.setAtivo(false);

        AlunoView alunoMock = new AlunoView(pacienteId, "Joao", "123", LocalDate.now(), "11999", UUID.randomUUID(), true, false);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(alunoRepository.findAllById(anyList())).thenReturn(List.of(alunoMock));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(Collections.emptyList());
        when(turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId)).thenReturn(Optional.of(vinculoExistente));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        turmaService.adicionarAlunos(turmaId, List.of(pacienteId));

        assertTrue(vinculoExistente.getAtivo());
        verify(turmaRepository, times(1)).save(turma);
    }

    @Test
    void adicionarAlunos_DeveLancarExcecaoQuandoAlunoJaAtivoEmOutraTurma() {
        Turma outraTurma = new Turma();
        outraTurma.setId(UUID.randomUUID());
        TurmaAluno taOutro = new TurmaAluno();
        taOutro.setTurma(outraTurma);
        taOutro.setPacienteId(pacienteId);
        taOutro.setAtivo(true);

        AlunoView alunoMock = new AlunoView(pacienteId, "Joao", "123", LocalDate.now(), "11999", UUID.randomUUID(), true, false);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(alunoRepository.findAllById(anyList())).thenReturn(List.of(alunoMock));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(List.of(taOutro));
        when(alunoRepository.findById(pacienteId)).thenReturn(Optional.of(alunoMock));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                turmaService.adicionarAlunos(turmaId, List.of(pacienteId)));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertTrue(exception.getReason().contains("Joao"));
        verify(turmaRepository, never()).save(any());
    }

    @Test
    void adicionarAlunos_DeveLancarExcecaoQuandoTurmaInativa() {
        turma.setAtiva(false);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                turmaService.adicionarAlunos(turmaId, List.of(pacienteId)));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertTrue(exception.getReason().contains("turma inativa"));
        verify(turmaRepository, never()).save(any());
    }

    @Test
    void ativarAluno_DeveAtivarComSucessoQuandoAlunoNaoEstaEmOutraTurma() {
        TurmaAluno turmaAluno = new TurmaAluno();
        turmaAluno.setTurma(turma);
        turmaAluno.setPacienteId(pacienteId);
        turmaAluno.setAtivo(false);

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(Collections.emptyList());
        when(turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId)).thenReturn(Optional.of(turmaAluno));
        when(turmaAlunoRepository.save(any(TurmaAluno.class))).thenReturn(turmaAluno);

        turmaService.ativarAluno(turmaId, pacienteId);

        assertTrue(turmaAluno.getAtivo());
        verify(turmaAlunoRepository, times(1)).save(turmaAluno);
    }

    @Test
    void ativarAluno_DeveLancarExcecaoSeAlunoAtivoEmOutraTurma() {
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));

        Turma outraTurma = new Turma();
        outraTurma.setId(UUID.randomUUID());
        TurmaAluno taOutro = new TurmaAluno();
        taOutro.setTurma(outraTurma);
        taOutro.setPacienteId(pacienteId);
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(List.of(taOutro));

        AlunoView alunoMock = new AlunoView(pacienteId, "Joao", "123", LocalDate.now(), "11999", UUID.randomUUID(), true, false);
        when(alunoRepository.findById(pacienteId)).thenReturn(Optional.of(alunoMock));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                turmaService.ativarAluno(turmaId, pacienteId));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertTrue(exception.getReason().contains("Joao"));
        assertTrue(exception.getReason().contains("já está ativo em outra turma"));
        verify(turmaAlunoRepository, never()).save(any());
    }

    @Test
    void ativarTurma_DeveAtivarTurmaECascatearStatusParaAlunos() {
        turma.setAtiva(false);
        TurmaAluno ta = new TurmaAluno();
        ta.setPacienteId(pacienteId);
        ta.setAtivo(false);
        ta.setTurma(turma);
        turma.setTurmaAlunos(Set.of(ta));

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(Collections.emptyList());
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        TurmaResponseDTO response = turmaService.ativarTurma(turmaId);

        assertTrue(turma.getAtiva());
        assertTrue(ta.getAtivo());
        assertTrue(response.getAtiva());
        verify(turmaRepository, times(1)).save(turma);
    }

    @Test
    void ativarTurma_NaoDeveAtivarAlunoQueJaEstaAtivoEmOutraTurma() {
        turma.setAtiva(false);
        TurmaAluno ta = new TurmaAluno();
        ta.setPacienteId(pacienteId);
        ta.setAtivo(false);
        ta.setTurma(turma);
        turma.setTurmaAlunos(Set.of(ta));

        Turma outraTurma = new Turma();
        outraTurma.setId(UUID.randomUUID());
        TurmaAluno taOutro = new TurmaAluno();
        taOutro.setTurma(outraTurma);
        taOutro.setPacienteId(pacienteId);

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)).thenReturn(List.of(taOutro));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        turmaService.ativarTurma(turmaId);

        assertFalse(ta.getAtivo());
        assertTrue(turma.getAtiva());
        verify(turmaRepository, times(1)).save(turma);
    }

    @Test
    void desativarTurma_DeveDesativarTurmaECascatearStatusParaAlunos() {
        TurmaAluno ta = new TurmaAluno();
        ta.setPacienteId(pacienteId);
        ta.setAtivo(true);
        ta.setTurma(turma);
        turma.setTurmaAlunos(Set.of(ta));

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        TurmaResponseDTO response = turmaService.desativarTurma(turmaId);

        assertFalse(turma.getAtiva());
        assertFalse(ta.getAtivo());
        assertFalse(response.getAtiva());
        verify(turmaRepository, times(1)).save(turma);
    }

    @Test
    void listarTurmas_DeveRetornarResumoComContadoresCorretos() {
        TurmaAluno taAtivo = new TurmaAluno();
        taAtivo.setPacienteId(UUID.randomUUID());
        taAtivo.setAtivo(true);
        taAtivo.setTurma(turma);

        TurmaAluno taInativo = new TurmaAluno();
        taInativo.setPacienteId(UUID.randomUUID());
        taInativo.setAtivo(false);
        taInativo.setTurma(turma);

        turma.setTurmaAlunos(Set.of(taAtivo, taInativo));

        when(turmaRepository.findAll()).thenReturn(List.of(turma));

        List<TurmaResumoDTO> resumos = turmaService.listarTurmas(null, null, null, null, null, null);

        assertEquals(1, resumos.size());
        TurmaResumoDTO resumo = resumos.get(0);
        assertEquals(turmaId, resumo.getId());
        assertEquals("Artes Manha - 2024", resumo.getNome());
        assertEquals(2024, resumo.getAnoCriacao());
        assertEquals("MANHA", resumo.getTurno());
        assertEquals("Artes", resumo.getTipo());
        assertTrue(resumo.getAtiva());
        assertEquals(2L, resumo.getTotalAlunos());
        assertEquals(1L, resumo.getTotalAlunosAtivos());
        assertEquals("Segunda a Sexta - 8h as 12h", resumo.getHorario());
        assertNull(resumo.getProfessor());
        verify(turmaRepository, times(1)).findAll();
    }

    @Test
    void listarTurmas_DeveFiltrarPorTurnoCorretamente() {
        Turma outraTurma = new Turma();
        outraTurma.setId(UUID.randomUUID());
        outraTurma.setNome("Artes Tarde - 2024");
        outraTurma.setTurno("TARDE");
        outraTurma.setTipo("Artes");
        outraTurma.setAnoCriacao(2024);
        outraTurma.setAtiva(true);
        outraTurma.setTurmaAlunos(new HashSet<>());

        when(turmaRepository.findAll()).thenReturn(List.of(turma, outraTurma));

        List<TurmaResumoDTO> resumos = turmaService.listarTurmas(null, null, null, "MANHA", null, null);

        assertEquals(1, resumos.size());
        assertEquals("MANHA", resumos.get(0).getTurno());
    }

    @Test
    void listarTurmas_DeveFiltrarPorStatusAtiva() {
        turma.setAtiva(false);
        Turma turmaAtiva = new Turma();
        turmaAtiva.setId(UUID.randomUUID());
        turmaAtiva.setNome("Artes Tarde - 2024");
        turmaAtiva.setTurno("TARDE");
        turmaAtiva.setTipo("Artes");
        turmaAtiva.setAnoCriacao(2024);
        turmaAtiva.setAtiva(true);
        turmaAtiva.setTurmaAlunos(new HashSet<>());

        when(turmaRepository.findAll()).thenReturn(List.of(turma, turmaAtiva));

        List<TurmaResumoDTO> resumos = turmaService.listarTurmas(null, null, null, null, null, true);

        assertEquals(1, resumos.size());
        assertTrue(resumos.get(0).getAtiva());
    }
}
