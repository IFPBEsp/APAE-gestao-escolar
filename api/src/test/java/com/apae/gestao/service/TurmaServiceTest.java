package com.apae.gestao.service;

import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
    @DisplayName("Deve criar turma com o nome base e horário da manhã quando não existe turma com o mesmo nome")
    void criar_Sucesso() {
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
    @DisplayName("Deve gerar o nome com sufixo (2) quando já existe uma turma com o nome base")
    void criar_SucessoNomeIncremental() {
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
    @DisplayName("Deve gerar o nome com sufixo (3) quando o nome base e o sufixo (2) já existem")
    void criar_SucessoNomeSufixo3() {
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
    @DisplayName("Deve deduzir o horário 'Segunda a Sexta - 14h as 18h' quando o turno da turma é TARDE")
    void criar_SucessoHorarioTarde() {
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

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(2)).save(captor.capture());
        assertEquals("Artes Tarde - 2024", captor.getAllValues().get(0).getNome());
        assertEquals("TARDE", captor.getAllValues().get(0).getTurno());
        assertEquals("Segunda a Sexta - 14h as 18h", response.getHorario());
    }

    @Test
    @DisplayName("Deve atualizar os campos da turma e manter o nome quando não há colisão com outra turma")
    void atualizar_Sucesso() {
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
    @DisplayName("Deve gerar nome incremental com sufixo (2) quando o nome atualizado colide com outra turma")
    void atualizar_SucessoNomeIncremental() {
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
    @DisplayName("Deve vincular o aluno como ativo na turma quando ele existe e não pertence a nenhuma turma ativa")
    void adicionarAlunos_Sucesso() {
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
    @DisplayName("Deve reativar o vínculo existente inativo em vez de criar um novo quando o aluno já pertenceu à turma")
    void adicionarAlunos_SucessoReativaVinculo() {
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
        assertTrue(turma.getTurmaAlunos().isEmpty());
        verify(turmaRepository, times(1)).save(turma);
    }

    @Test
    @DisplayName("Deve lançar exceção 422 contendo o nome do aluno quando ele já está ativo em outra turma")
    void adicionarAlunos_FalhaAlunoAtivoEmOutraTurma() {
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
        assertTrue(turma.getTurmaAlunos().isEmpty());
        verify(turmaRepository, never()).save(any());
        verify(turmaAlunoRepository, never()).findByTurmaAndPacienteId(any(), any());
    }

    @Test
    @DisplayName("Deve lançar exceção 422 e não salvar nada quando a turma está inativa")
    void adicionarAlunos_FalhaTurmaInativa() {
        turma.setAtiva(false);
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                turmaService.adicionarAlunos(turmaId, List.of(pacienteId)));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertTrue(exception.getReason().contains("turma inativa"));
        assertTrue(turma.getTurmaAlunos().isEmpty());
        verify(turmaRepository, never()).save(any());
        verifyNoInteractions(alunoRepository);
        verifyNoInteractions(turmaAlunoRepository);
    }

    @Test
    @DisplayName("Deve lançar exceção e não vincular nem salvar nada quando algum ID de aluno informado não existe")
    void adicionarAlunos_FalhaAlunoNaoEncontrado() {
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(alunoRepository.findAllById(anyList())).thenReturn(Collections.emptyList());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                turmaService.adicionarAlunos(turmaId, List.of(pacienteId)));

        assertTrue(exception.getMessage().contains("Um ou mais IDs de aluno não foram encontrados"));
        assertTrue(turma.getTurmaAlunos().isEmpty());
        verify(turmaRepository, never()).save(any());
        verifyNoInteractions(turmaAlunoRepository);
    }

    @Test
    @DisplayName("Deve vincular o professor à turma e retornar seus dados no response quando a turma está ativa e o professor existe")
    void adicionarProfessor_Sucesso() {
        UUID professorId = UUID.randomUUID();
        UUID usuarioId = UUID.randomUUID();

        Professor professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(usuarioId);
        professor.setFormacao("Pedagogia");
        professor.setPrimeiroAcesso(false);

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setNomeCompleto("Maria da Silva");
        usuario.setCpf("12345678901");
        usuario.setEmail("maria@apae.org.br");
        usuario.setTelefone("11988880000");
        usuario.setAtivo(true);

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        assertNull(turma.getProfessor());

        TurmaResponseDTO response = turmaService.adicionarProfessor(turmaId, professorId);

        assertSame(professor, turma.getProfessor());
        assertEquals(turmaId, response.getId());
        assertNotNull(response.getProfessor());
        assertEquals(professorId, response.getProfessor().getId());
        assertEquals(usuarioId, response.getProfessor().getUsuarioId());
        assertEquals("Maria da Silva", response.getProfessor().getNome());
        assertEquals("12345678901", response.getProfessor().getCpf());
        assertEquals("maria@apae.org.br", response.getProfessor().getEmail());
        assertEquals("11988880000", response.getProfessor().getTelefone());
        assertEquals("Pedagogia", response.getProfessor().getFormacao());
        assertTrue(response.getProfessor().getAtivo());

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(1)).save(captor.capture());
        assertSame(turma, captor.getValue());
        assertSame(professor, captor.getValue().getProfessor());
        verify(turmaRepository, times(1)).findById(turmaId);
        verify(professorRepository, times(1)).findById(professorId);
        verify(usuarioRepository, times(1)).findById(usuarioId);
    }

    @Test
    @DisplayName("Deve substituir o professor anterior pelo novo professor quando a turma já possui um professor vinculado")
    void adicionarProfessor_SucessoSubstituiProfessor() {
        UUID professorAnteriorId = UUID.randomUUID();
        UUID usuarioAnteriorId = UUID.randomUUID();
        Professor professorAnterior = new Professor();
        professorAnterior.setId(professorAnteriorId);
        professorAnterior.setUsuarioId(usuarioAnteriorId);
        turma.setProfessor(professorAnterior);

        UUID professorNovoId = UUID.randomUUID();
        UUID usuarioNovoId = UUID.randomUUID();
        Professor professorNovo = new Professor();
        professorNovo.setId(professorNovoId);
        professorNovo.setUsuarioId(usuarioNovoId);

        Usuario usuarioNovo = new Usuario();
        usuarioNovo.setId(usuarioNovoId);
        usuarioNovo.setNomeCompleto("Ana Souza");

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(professorRepository.findById(professorNovoId)).thenReturn(Optional.of(professorNovo));
        when(usuarioRepository.findById(usuarioNovoId)).thenReturn(Optional.of(usuarioNovo));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        TurmaResponseDTO response = turmaService.adicionarProfessor(turmaId, professorNovoId);

        assertSame(professorNovo, turma.getProfessor());
        assertNotSame(professorAnterior, turma.getProfessor());
        assertEquals(professorNovoId, response.getProfessor().getId());
        assertEquals("Ana Souza", response.getProfessor().getNome());
        verify(turmaRepository, times(1)).save(turma);
        verify(professorRepository, never()).findById(professorAnteriorId);
        verify(usuarioRepository, never()).findById(usuarioAnteriorId);
    }

    @Test
    @DisplayName("Deve vincular o professor, mas retornar professor nulo no response quando o usuário associado ao professor não é encontrado")
    void adicionarProfessor_SucessoSemUsuario() {
        UUID professorId = UUID.randomUUID();
        UUID usuarioId = UUID.randomUUID();

        Professor professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(usuarioId);

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.empty());
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        TurmaResponseDTO response = turmaService.adicionarProfessor(turmaId, professorId);

        assertSame(professor, turma.getProfessor());
        assertNull(response.getProfessor());
        verify(turmaRepository, times(1)).save(turma);
        verify(usuarioRepository, times(1)).findById(usuarioId);
    }

    @Test
    @DisplayName("Deve lançar exceção 404 'Professor não encontrado' e não salvar a turma quando o professor não existe")
    void adicionarProfessor_FalhaProfessorNaoEncontrado() {
        UUID professorId = UUID.randomUUID();
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(professorRepository.findById(professorId)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                turmaService.adicionarProfessor(turmaId, professorId));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Professor não encontrado", exception.getReason());
        assertNull(turma.getProfessor());
        verify(turmaRepository, times(1)).findById(turmaId);
        verify(professorRepository, times(1)).findById(professorId);
        verifyNoMoreInteractions(turmaRepository);
        verifyNoInteractions(usuarioRepository);
    }

    @Test
    @DisplayName("Deve lançar exceção 422 sem consultar o professor nem salvar a turma quando a turma está inativa")
    void adicionarProfessor_FalhaTurmaInativa() {
        turma.setAtiva(false);
        UUID professorId = UUID.randomUUID();
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                turmaService.adicionarProfessor(turmaId, professorId));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatusCode());
        assertTrue(exception.getReason().contains("turma inativa"));
        assertNull(turma.getProfessor());
        verify(turmaRepository, times(1)).findById(turmaId);
        verifyNoMoreInteractions(turmaRepository);
        verifyNoInteractions(professorRepository);
        verifyNoInteractions(usuarioRepository);
    }

    @Test
    @DisplayName("Deve lançar RuntimeException 'Turma não encontrada' sem consultar o professor quando a turma não existe")
    void adicionarProfessor_FalhaTurmaNaoEncontrada() {
        UUID professorId = UUID.randomUUID();
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                turmaService.adicionarProfessor(turmaId, professorId));

        assertTrue(exception.getMessage().contains("Turma não encontrada"));
        verify(turmaRepository, times(1)).findById(turmaId);
        verifyNoMoreInteractions(turmaRepository);
        verifyNoInteractions(professorRepository);
        verifyNoInteractions(usuarioRepository);
    }

    @Test
    @DisplayName("Deve remover o professor da turma e retornar professor nulo no response quando a turma possui professor vinculado")
    void removerProfessor_Sucesso() {
        Professor professor = new Professor();
        professor.setId(UUID.randomUUID());
        professor.setUsuarioId(UUID.randomUUID());
        turma.setProfessor(professor);

        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        assertNotNull(turma.getProfessor());

        TurmaResponseDTO response = turmaService.removerProfessor(turmaId);

        assertNull(turma.getProfessor());
        assertNull(response.getProfessor());
        assertEquals(turmaId, response.getId());

        ArgumentCaptor<Turma> captor = ArgumentCaptor.forClass(Turma.class);
        verify(turmaRepository, times(1)).save(captor.capture());
        assertSame(turma, captor.getValue());
        assertNull(captor.getValue().getProfessor());
        verify(turmaRepository, times(1)).findById(turmaId);
        verifyNoInteractions(professorRepository);
        verifyNoInteractions(usuarioRepository);
    }

    @Test
    @DisplayName("Deve manter a turma sem professor e salvar normalmente quando a turma já não possuía professor vinculado")
    void removerProfessor_SucessoSemProfessor() {
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.of(turma));
        when(turmaRepository.save(any(Turma.class))).thenReturn(turma);

        assertNull(turma.getProfessor());

        TurmaResponseDTO response = turmaService.removerProfessor(turmaId);

        assertNull(turma.getProfessor());
        assertNull(response.getProfessor());
        verify(turmaRepository, times(1)).save(turma);
        verifyNoInteractions(professorRepository);
        verifyNoInteractions(usuarioRepository);
    }

    @Test
    @DisplayName("Deve lançar RuntimeException 'Turma não encontrada' e não salvar nada quando a turma não existe")
    void removerProfessor_FalhaTurmaNaoEncontrada() {
        when(turmaRepository.findById(turmaId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                turmaService.removerProfessor(turmaId));

        assertTrue(exception.getMessage().contains("Turma não encontrada"));
        assertTrue(exception.getMessage().contains(turmaId.toString()));
        verify(turmaRepository, times(1)).findById(turmaId);
        verifyNoMoreInteractions(turmaRepository);
        verifyNoInteractions(professorRepository);
        verifyNoInteractions(usuarioRepository);
    }

    @Test
    @DisplayName("Deve ativar o vínculo do aluno e salvar quando o aluno não está ativo em nenhuma outra turma")
    void ativarAluno_Sucesso() {
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
    @DisplayName("Deve lançar exceção 422 'já está ativo em outra turma' e não salvar quando o aluno está ativo em outra turma")
    void ativarAluno_FalhaAlunoAtivoEmOutraTurma() {
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
    @DisplayName("Deve ativar a turma e reativar em cascata os alunos quando eles não estão ativos em outra turma")
    void ativarTurma_Sucesso() {
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
    @DisplayName("Deve ativar a turma sem reativar o vínculo do aluno quando ele já está ativo em outra turma")
    void ativarTurma_SucessoAlunoEmOutraTurma() {
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
    @DisplayName("Deve desativar a turma e desativar em cascata todos os vínculos de alunos quando a turma é desativada")
    void desativarTurma_Sucesso() {
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
    @DisplayName("Deve retornar resumo com total de alunos, total de ativos e horário corretos quando listar turmas sem filtros")
    void listarTurmas_Sucesso() {
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
    @DisplayName("Deve retornar apenas as turmas do turno informado quando listar turmas filtrando por turno")
    void listarTurmas_SucessoFiltroTurno() {
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
    @DisplayName("Deve retornar apenas as turmas ativas quando listar turmas filtrando por status ativa verdadeiro")
    void listarTurmas_SucessoFiltroStatusAtiva() {
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
