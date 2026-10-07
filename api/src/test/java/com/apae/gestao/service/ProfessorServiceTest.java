package com.apae.gestao.service;

import com.apae.gestao.dto.professor.*;
import com.apae.gestao.entity.Endereco;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.exception.ConflitoDeDadosException;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.repository.EnderecoRepository;
import com.apae.gestao.repository.ProfessorDashboardRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfessorServiceTest {

    @InjectMocks
    private ProfessorService professorService;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private ProfessorDashboardRepository professorDashboardRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EnderecoRepository enderecoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UUID professorId;
    private UUID usuarioId;
    private UUID enderecoId;
    private Professor professor;
    private Usuario usuario;
    private Endereco endereco;
    private ProfessorRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        professorId = UUID.randomUUID();
        usuarioId   = UUID.randomUUID();
        enderecoId  = UUID.randomUUID();

        endereco = new Endereco();
        endereco.setId(enderecoId);
        endereco.setCidade("João Pessoa");
        endereco.setCep("58000-000");
        endereco.setEstado("PB");
        endereco.setBairro("Centro");
        endereco.setRua("Rua A");
        endereco.setNumero("123");
        endereco.setComplemento("Apto 1");

        usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setNomeCompleto("João Professor");
        usuario.setCpf("12345678900");
        usuario.setEmail("joao@example.com");
        usuario.setTelefone("83999999999");
        usuario.setEnderecoId(enderecoId);
        usuario.setAtivo(true);
        usuario.setCargo("GESTAO_ESCOLAR");

        professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(usuarioId);
        professor.setFormacao("Matemática");
        professor.setDataContratacao(LocalDate.of(2023, 1, 15));
        professor.setDataNascimento(LocalDate.of(1980, 5, 10));
        professor.setPrimeiroAcesso(true);

        EnderecoDTO enderecoDTO = new EnderecoDTO();
        enderecoDTO.setCidade("João Pessoa");
        enderecoDTO.setCep("58000-000");
        enderecoDTO.setEstado("PB");
        enderecoDTO.setBairro("Centro");
        enderecoDTO.setRua("Rua A");
        enderecoDTO.setNumero("123");
        enderecoDTO.setComplemento("Apto 1");

        requestDTO = new ProfessorRequestDTO();
        requestDTO.setNome("João Professor");
        requestDTO.setCpf("12345678900");
        requestDTO.setEmail("joao@example.com");
        requestDTO.setTelefone("83999999999");
        requestDTO.setFormacao("Matemática");
        requestDTO.setDataContratacao(LocalDate.of(2023, 1, 15));
        requestDTO.setDataNascimento(LocalDate.of(1980, 5, 10));
        requestDTO.setEndereco(enderecoDTO);
        requestDTO.setAtivo(true);
    }

    // =========================================================================
    // CRIAR
    // =========================================================================

    @Test
    @DisplayName("Deve criar um professor com sucesso")
    void deveCriarProfessorComSucesso() {
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("senha-criptografada");
        when(enderecoRepository.save(any(Endereco.class))).thenReturn(endereco);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(professorRepository.save(any(Professor.class))).thenReturn(professor);

        ProfessorResponseDTO response = professorService.criar(requestDTO);

        assertNotNull(response);
        assertEquals(professorId, response.getId());
        assertEquals(usuarioId, response.getUsuarioId());
        assertEquals("João Professor", response.getNome());
        assertEquals("12345678900", response.getCpf());
        assertEquals("joao@example.com", response.getEmail());
        assertEquals("83999999999", response.getTelefone());
        assertEquals("Matemática", response.getFormacao());
        assertEquals(LocalDate.of(2023, 1, 15), response.getDataContratacao());
        assertEquals(LocalDate.of(1980, 5, 10), response.getDataNascimento());
        assertTrue(response.getAtivo());
        assertTrue(response.getPrimeiroAcesso());
        verify(enderecoRepository, times(1)).save(any(Endereco.class));
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
        verify(professorRepository, times(1)).save(any(Professor.class));
    }

    @Test
    @DisplayName("Deve lançar ConflitoDeDadosException ao criar professor com CPF já existente")
    void deveLancarConflitoDeDadosAoCriarComCpfExistente() {
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(UUID.randomUUID());
        when(usuarioRepository.findByCpf(requestDTO.getCpf())).thenReturn(Optional.of(usuarioExistente));

        ConflitoDeDadosException exception = assertThrows(ConflitoDeDadosException.class,
                () -> professorService.criar(requestDTO));

        assertEquals("Já existe um usuário cadastrado com este CPF", exception.getMessage());
        verify(usuarioRepository, never()).save(any());
        verify(professorRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ConflitoDeDadosException ao criar professor com e-mail já existente")
    void deveLancarConflitoDeDadosAoCriarComEmailExistente() {
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(UUID.randomUUID());
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail(requestDTO.getEmail())).thenReturn(Optional.of(usuarioExistente));

        ConflitoDeDadosException exception = assertThrows(ConflitoDeDadosException.class,
                () -> professorService.criar(requestDTO));

        assertEquals("Já existe um usuário cadastrado com este e-mail", exception.getMessage());
        verify(usuarioRepository, never()).save(any());
        verify(professorRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ResponseStatusException (BAD_REQUEST) ao criar professor com endereço incompleto")
    void deveLancarBadRequestAoCriarComEnderecoIncompleto() {
        requestDTO.getEndereco().setCidade(null);
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> professorService.criar(requestDTO));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertNotNull(exception.getReason());
        assertTrue(exception.getReason().contains("Endereço incompleto"));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ResponseStatusException (FORBIDDEN) ao criar professor com permission denied no UsuarioRepository")
    void deveLancarForbiddenAoCriarComPermissaoDeniedNoUsuario() {
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("senha");
        when(enderecoRepository.save(any(Endereco.class))).thenReturn(endereco);

        DataAccessException causaPermissao = new DataAccessException("Erro", new RuntimeException("permission denied")) {};
        when(usuarioRepository.save(any(Usuario.class))).thenThrow(causaPermissao);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> professorService.criar(requestDTO));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertNotNull(exception.getReason());
        assertTrue(exception.getReason().contains("Sem permissão para inserir ou atualizar apae_geral.usuarios"));
    }

    @Test
    @DisplayName("Deve lançar ResponseStatusException (FORBIDDEN) ao criar professor com permission denied no EnderecoRepository")
    void deveLancarForbiddenAoCriarComPermissaoDeniedNoEndereco() {
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        DataAccessException causaPermissao = new DataAccessException("Erro", new RuntimeException("permission denied")) {};
        when(enderecoRepository.save(any(Endereco.class))).thenThrow(causaPermissao);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> professorService.criar(requestDTO));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertNotNull(exception.getReason());
        assertTrue(exception.getReason().contains("Sem permissão para inserir ou atualizar apae_geral.enderecos"));
        verify(usuarioRepository, never()).save(any());
    }

    // =========================================================================
    // ATUALIZAR
    // =========================================================================

    @Test
    @DisplayName("Deve atualizar professor com sucesso, validando todos os campos mutados")
    void deveAtualizarProfessorComSucesso() {
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(enderecoRepository.findById(enderecoId)).thenReturn(Optional.of(endereco));
        when(enderecoRepository.save(any(Endereco.class))).thenReturn(endereco);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(professorRepository.save(any(Professor.class))).thenReturn(professor);

        requestDTO.setNome("João Atualizado");
        requestDTO.setFormacao("Física");
        requestDTO.setDataContratacao(LocalDate.of(2024, 3, 20));
        requestDTO.setDataNascimento(LocalDate.of(1985, 7, 15));

        ProfessorResponseDTO response = professorService.atualizar(professorId, requestDTO);

        assertNotNull(response);
        assertEquals("João Atualizado", response.getNome());
        assertEquals("Física", response.getFormacao());
        assertEquals(LocalDate.of(2024, 3, 20), response.getDataContratacao());
        assertEquals(LocalDate.of(1985, 7, 15), response.getDataNascimento());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
        verify(professorRepository, times(1)).save(any(Professor.class));
    }

    @Test
    @DisplayName("Deve lançar ConflitoDeDadosException ao atualizar professor com CPF já existente em outro usuário")
    void deveLancarConflitoDeDadosAoAtualizarComCpfExistente() {
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));

        Usuario outrousuario = new Usuario();
        outrousuario.setId(UUID.randomUUID());
        when(usuarioRepository.findByCpf(requestDTO.getCpf())).thenReturn(Optional.of(outrousuario));

        ConflitoDeDadosException exception = assertThrows(ConflitoDeDadosException.class,
                () -> professorService.atualizar(professorId, requestDTO));

        assertEquals("Já existe um usuário cadastrado com este CPF", exception.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ConflitoDeDadosException ao atualizar professor com e-mail já existente em outro usuário")
    void deveLancarConflitoDeDadosAoAtualizarComEmailExistente() {
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findByCpf(anyString())).thenReturn(Optional.empty());

        Usuario outrousuario = new Usuario();
        outrousuario.setId(UUID.randomUUID());
        when(usuarioRepository.findByEmail(requestDTO.getEmail())).thenReturn(Optional.of(outrousuario));

        ConflitoDeDadosException exception = assertThrows(ConflitoDeDadosException.class,
                () -> professorService.atualizar(professorId, requestDTO));

        assertEquals("Já existe um usuário cadastrado com este e-mail", exception.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar RecursoNaoEncontradoException ao atualizar professor com ID inexistente")
    void deveLancarRecursoNaoEncontradoAoAtualizarComIdInexistente() {
        UUID idInexistente = UUID.randomUUID();
        when(professorRepository.findById(idInexistente)).thenReturn(Optional.empty());

        RecursoNaoEncontradoException exception = assertThrows(RecursoNaoEncontradoException.class,
                () -> professorService.atualizar(idInexistente, requestDTO));

        assertTrue(exception.getMessage().contains("Professor não encontrado com ID: " + idInexistente));
    }

    // =========================================================================
    // INATIVAR / REATIVAR
    // =========================================================================

    @Test
    @DisplayName("Deve inativar professor com sucesso")
    void deveInativarProfessorComSucesso() {
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(enderecoRepository.findById(enderecoId)).thenReturn(Optional.of(endereco));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        ProfessorResponseDTO response = professorService.inativar(professorId);

        assertNotNull(response);
        assertFalse(response.getAtivo());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    @DisplayName("Deve reativar professor com sucesso")
    void deveReativarProfessorComSucesso() {
        usuario.setAtivo(false);
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(enderecoRepository.findById(enderecoId)).thenReturn(Optional.of(endereco));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        ProfessorResponseDTO response = professorService.reativarProfessor(professorId);

        assertNotNull(response);
        assertTrue(response.getAtivo());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    @DisplayName("Deve lançar RecursoNaoEncontradoException ao inativar professor com ID inexistente")
    void deveLancarRecursoNaoEncontradoAoInativarComIdInexistente() {
        UUID idInexistente = UUID.randomUUID();
        when(professorRepository.findById(idInexistente)).thenReturn(Optional.empty());

        RecursoNaoEncontradoException exception = assertThrows(RecursoNaoEncontradoException.class,
                () -> professorService.inativar(idInexistente));

        assertTrue(exception.getMessage().contains("Professor não encontrado com ID: " + idInexistente));
    }

    // =========================================================================
    // BUSCAS
    // =========================================================================

    @Test
    @DisplayName("Deve listar professores sem filtros e validar todos os campos do DTO")
    void deveListarProfessoresSemFiltros() {
        Object[] row = new Object[]{professorId, true, "João Professor", "joao@example.com", "Turma A"};
        when(professorRepository.listarProfessoresOtimizado(null, null, null, null))
                .thenReturn(Collections.singletonList(row));

        List<ProfessorListagemDTO> result = professorService.listarProfessores(null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        ProfessorListagemDTO dto = result.get(0);
        assertEquals(professorId, dto.getId());
        assertTrue(dto.getAtivo());
        assertEquals("João Professor", dto.getNome());
        assertEquals("joao@example.com", dto.getEmail());
        assertEquals("Turma A", dto.getTurmas());
    }

    @Test
    @DisplayName("Deve listar professores com filtros e delegar parâmetros corretamente ao repositório")
    void deveListarProfessoresComFiltros() {
        String nomeFiltro = "João";
        String emailFiltro = "joao@example.com";
        Object[] row = new Object[]{professorId, true, "João Professor", "joao@example.com", null};
        when(professorRepository.listarProfessoresOtimizado(professorId, nomeFiltro, emailFiltro, true))
                .thenReturn(Collections.singletonList(row));

        List<ProfessorListagemDTO> result = professorService.listarProfessores(professorId, nomeFiltro, emailFiltro, true);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(professorRepository, times(1)).listarProfessoresOtimizado(professorId, nomeFiltro, emailFiltro, true);
    }

    @Test
    @DisplayName("Deve buscar professor por ID e validar todos os campos do DTO de resposta")
    void deveBuscarProfessorPorId() {
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(enderecoRepository.findById(enderecoId)).thenReturn(Optional.of(endereco));

        ProfessorResponseDTO result = professorService.buscarPorId(professorId);

        assertNotNull(result);
        assertEquals(professorId, result.getId());
        assertEquals(usuarioId, result.getUsuarioId());
        assertEquals("João Professor", result.getNome());
        assertEquals("12345678900", result.getCpf());
        assertEquals("joao@example.com", result.getEmail());
        assertEquals("83999999999", result.getTelefone());
        assertEquals("Matemática", result.getFormacao());
        assertEquals(LocalDate.of(2023, 1, 15), result.getDataContratacao());
        assertEquals(LocalDate.of(1980, 5, 10), result.getDataNascimento());
        assertTrue(result.getAtivo());
        assertTrue(result.getPrimeiroAcesso());
        assertNotNull(result.getEndereco());
        assertEquals("João Pessoa", result.getEndereco().getCidade());
    }

    @Test
    @DisplayName("Deve lançar RecursoNaoEncontradoException ao buscar professor por ID inexistente")
    void deveLancarRecursoNaoEncontradoAoBuscarPorIdInexistente() {
        UUID idInexistente = UUID.randomUUID();
        when(professorRepository.findById(idInexistente)).thenReturn(Optional.empty());

        RecursoNaoEncontradoException exception = assertThrows(RecursoNaoEncontradoException.class,
                () -> professorService.buscarPorId(idInexistente));

        assertTrue(exception.getMessage().contains("Professor não encontrado com ID: " + idInexistente));
    }

    @Test
    @DisplayName("Deve buscar professor por ID resumido e validar todos os campos do ProfessorResumoDTO")
    void deveBuscarProfessorPorIdResumido() {
        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(enderecoRepository.findById(enderecoId)).thenReturn(Optional.of(endereco));

        ProfessorResumoDTO result = professorService.buscarPorIdResumido(professorId);

        assertNotNull(result);
        assertEquals(professorId, result.getId());
        assertEquals(usuarioId, result.getUsuarioId());
        assertEquals("João Professor", result.getNome());
        assertEquals("12345678900", result.getCpf());
        assertEquals("joao@example.com", result.getEmail());
        assertEquals("83999999999", result.getTelefone());
        assertTrue(result.getAtivo());
        assertEquals("Matemática", result.getFormacao());
        assertEquals(LocalDate.of(2023, 1, 15), result.getDataContratacao());
        assertEquals(LocalDate.of(1980, 5, 10), result.getDataNascimento());
        assertTrue(result.getPrimeiroAcesso());
        assertNotNull(result.getEndereco());
        assertEquals("João Pessoa", result.getEndereco().getCidade());
        assertEquals("58000-000", result.getEndereco().getCep());
        assertEquals("PB", result.getEndereco().getEstado());
    }

    @Test
    @DisplayName("Deve buscar dashboard do professor e validar todos os campos numéricos retornados")
    void deveBuscarDashboard() {
        when(usuarioRepository.findByEmail("joao@example.com")).thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId)).thenReturn(Optional.of(professor));

        Object[] row = new Object[]{10L, 5L, 4.5, 20L, 15L, 2L, 0L};
        when(professorDashboardRepository.buscarResumoDashboard(professorId))
                .thenReturn(Collections.singletonList(row));

        ProfessorDashboardDTO result = professorService.buscarDashboard("joao@example.com");

        assertNotNull(result);
        assertEquals(professorId, result.getProfessorId());
        assertEquals("João Professor", result.getNome());
        assertEquals(10L, result.getTotalTurmasAtivas());
        assertEquals(5L, result.getTotalAlunosAtivos());
        assertEquals(4.5, result.getFrequenciaMedia());
        assertEquals(20L, result.getAulasRealizadas());
        assertEquals(15L, result.getAlunosComFrequenciaBaixa());
        assertEquals(2L, result.getTotalPresencas());
        assertEquals(0L, result.getTotalFaltas());
    }

    @Test
    @DisplayName("Deve lançar RecursoNaoEncontradoException ao buscar dashboard com e-mail não cadastrado")
    void deveLancarRecursoNaoEncontradoAoBuscarDashboardComEmailInexistente() {
        when(usuarioRepository.findByEmail("naoexiste@example.com")).thenReturn(Optional.empty());

        RecursoNaoEncontradoException exception = assertThrows(RecursoNaoEncontradoException.class,
                () -> professorService.buscarDashboard("naoexiste@example.com"));

        assertTrue(exception.getMessage().contains("Usuário autenticado não encontrado"));
    }
}
