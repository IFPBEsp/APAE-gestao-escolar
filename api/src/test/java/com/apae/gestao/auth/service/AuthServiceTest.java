package com.apae.gestao.auth.service;

import com.apae.gestao.dto.auth.LoginRequestDTO;
import com.apae.gestao.dto.auth.LoginResponseDTO;
import com.apae.gestao.dto.auth.PrimeiroAcessoRequestDTO;
import com.apae.gestao.dto.auth.RedefinirSenhaRequestDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.UsuarioRepository;
import com.apae.gestao.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void configurarCredenciaisAdmin() {
        ReflectionTestUtils.setField(
                authService,
                "adminEmail",
                "admin@teste.com"
        );

        ReflectionTestUtils.setField(
                authService,
                "adminPassword",
                "senha-admin"
        );
    }

    @Test
    void deveRealizarLoginComoAdmin() {
        LoginRequestDTO request =
                new LoginRequestDTO("admin@teste.com", "senha-admin");

        when(jwtService.generateToken("admin@teste.com", "ADMIN"))
                .thenReturn("token-admin");

        LoginResponseDTO response = authService.login(request);

        assertEquals("token-admin", response.getToken());
        assertEquals("ADMIN", response.getRole());
        assertEquals(null, response.getId());

        verify(jwtService).generateToken("admin@teste.com", "ADMIN");
        verifyNoInteractions(usuarioRepository, professorRepository, passwordEncoder);
    }

    @Test
    void deveRecusarLoginDoAdminComSenhaIncorreta() {
        LoginRequestDTO request =
                new LoginRequestDTO("admin@teste.com", "senha-errada");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals("Senha errada", exception.getReason());

        verifyNoInteractions(
                usuarioRepository,
                professorRepository,
                jwtService,
                passwordEncoder
        );
    }

    @Test
    void deveRealizarLoginComoProfessor() {
        UUID usuarioId = UUID.randomUUID();
        UUID professorId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCargo("GESTAO_ESCOLAR");
        usuario.setAtivo(true);
        usuario.setSenha("senha-hash");

        Professor professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(usuarioId);
        professor.setPrimeiroAcesso(false);

        LoginRequestDTO request =
                new LoginRequestDTO("professor@teste.com", "senha");

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha", "senha-hash"))
                .thenReturn(true);
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.of(professor));
        when(jwtService.generateToken("professor@teste.com", "TEACHER"))
                .thenReturn("token-professor");

        LoginResponseDTO response = authService.login(request);

        assertEquals("token-professor", response.getToken());
        assertEquals("TEACHER", response.getRole());
        assertEquals(professorId, response.getId());

        verify(jwtService).generateToken("professor@teste.com", "TEACHER");
    }

    @Test
    void deveRecusarLoginQuandoProfessorNaoForEncontrado() {
        LoginRequestDTO request =
                new LoginRequestDTO("professor@teste.com", "senha");

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals("Professor não encontrado", exception.getReason());
    }

    @Test
    void deveRecusarLoginQuandoProfessorNaoForEncontradoNoRepositorio() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCargo("GESTAO_ESCOLAR");
        usuario.setAtivo(true);
        usuario.setSenha("senha-hash");

        LoginRequestDTO request =
               new LoginRequestDTO("professor@teste.com", "senha");

        when(usuarioRepository.findByEmail("professor@teste.com"))
            .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha", "senha-hash"))
            .thenReturn(true);
        when(professorRepository.findByUsuarioId(usuarioId))
            .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals("Professor não encontrado", exception.getReason());

        verify(professorRepository).findByUsuarioId(usuarioId);
    }

    @Test
    void deveRecusarLoginQuandoCargoForIncorreto() {
        Usuario usuario = new Usuario();
        usuario.setEmail("usuario@teste.com");
        usuario.setCargo("ADMIN");
        usuario.setAtivo(true);

        LoginRequestDTO request =
                new LoginRequestDTO("usuario@teste.com", "senha");

        when(usuarioRepository.findByEmail("usuario@teste.com"))
                .thenReturn(Optional.of(usuario));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals(
                "Usuário não pertence ao Gestão Escolar",
                exception.getReason()
        );

        verifyNoInteractions(passwordEncoder, professorRepository, jwtService);
    }

    @Test
    void deveRecusarLoginQuandoUsuarioEstiverInativo() {
        Usuario usuario = new Usuario();
        usuario.setEmail("professor@teste.com");
        usuario.setCargo("GESTAO_ESCOLAR");
        usuario.setAtivo(false);

        LoginRequestDTO request =
                new LoginRequestDTO("professor@teste.com", "senha");

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals(
                "Professor inativado no sistema",
                exception.getReason()
        );

        verifyNoInteractions(passwordEncoder, professorRepository, jwtService);
    }

    @Test
    void deveRecusarLoginQuandoSenhaEstiverIncorreta() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCargo("GESTAO_ESCOLAR");
        usuario.setAtivo(true);
        usuario.setSenha("senha-hash");

        LoginRequestDTO request =
                new LoginRequestDTO("professor@teste.com", "senha-errada");

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-errada", "senha-hash"))
                .thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals("Senha incorreta", exception.getReason());

        verifyNoInteractions(professorRepository, jwtService);
    }

    @Test
    void deveBloquearLoginNoPrimeiroAcesso() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCargo("GESTAO_ESCOLAR");
        usuario.setAtivo(true);
        usuario.setSenha("senha-hash");

        Professor professor = new Professor();
        professor.setUsuarioId(usuarioId);
        professor.setPrimeiroAcesso(true);

        LoginRequestDTO request =
                new LoginRequestDTO("professor@teste.com", "senha");

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha", "senha-hash"))
                .thenReturn(true);
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.of(professor));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertEquals("PRIMEIRO_ACESSO", exception.getReason());

        verifyNoInteractions(jwtService);
    }

    @Test
    void deveRealizarPrimeiroAcesso() {
        UUID usuarioId = UUID.randomUUID();
        UUID professorId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setSenha("senha-antiga");

        Professor professor = new Professor();
        professor.setId(professorId);
        professor.setUsuarioId(usuarioId);
        professor.setPrimeiroAcesso(true);

        PrimeiroAcessoRequestDTO request =
                new PrimeiroAcessoRequestDTO(
                        "professor@teste.com",
                        "nova-senha"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.of(professor));
        when(passwordEncoder.encode("nova-senha"))
                .thenReturn("nova-senha-hash");
        when(usuarioRepository.save(usuario))
                .thenReturn(usuario);

        authService.primeiroAcesso(request);

        assertEquals("nova-senha-hash", usuario.getSenha());
        assertEquals(false, professor.getPrimeiroAcesso());

        verify(passwordEncoder).encode("nova-senha");
        verify(usuarioRepository).save(usuario);
        verify(professorRepository).save(professor);
    }

    @Test
    void deveRetornarErroClaroQuandoSalvarUsuarioFalharPorPermissao() {
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setEmail("professor@teste.com");
        usuario.setSenha("senha-antiga");

        Professor professor = new Professor();
        professor.setPrimeiroAcesso(true);

        PrimeiroAcessoRequestDTO request =
                new PrimeiroAcessoRequestDTO("professor@teste.com", "nova-senha");

        when(usuarioRepository.findByEmail("professor@teste.com"))
               .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuario.getId()))
               .thenReturn(Optional.of(professor));
        when(passwordEncoder.encode("nova-senha"))
               .thenReturn("senha-hash");

        when(usuarioRepository.save(usuario))
               .thenThrow(new org.springframework.dao.DataAccessException("permission denied") {});

        ResponseStatusException exception = assertThrows(
               ResponseStatusException.class,
               () -> authService.primeiroAcesso(request)
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertEquals(
            "Sem permissão para inserir ou atualizar apae_geral.usuarios",
            exception.getReason()
        );
    }

    @Test
    void deveRecusarPrimeiroAcessoQuandoUsuarioNaoForEncontrado() {
        PrimeiroAcessoRequestDTO request =
                new PrimeiroAcessoRequestDTO(
                        "professor@teste.com",
                        "nova-senha"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.primeiroAcesso(request)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(professorRepository, passwordEncoder);
    }

    @Test
    void deveRecusarPrimeiroAcessoQuandoProfessorNaoForEncontrado() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");

        PrimeiroAcessoRequestDTO request =
                new PrimeiroAcessoRequestDTO(
                        "professor@teste.com",
                        "nova-senha"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.primeiroAcesso(request)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void deveRecusarPrimeiroAcessoQuandoJaTiverSidoRealizado() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");

        Professor professor = new Professor();
        professor.setUsuarioId(usuarioId);
        professor.setPrimeiroAcesso(false);

        PrimeiroAcessoRequestDTO request =
                new PrimeiroAcessoRequestDTO(
                        "professor@teste.com",
                        "nova-senha"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.of(professor));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.primeiroAcesso(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals(
                "Primeiro acesso já realizado",
                exception.getReason()
        );

        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void deveRedefinirSenha() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCpf("123.456.789-00");

        Professor professor = new Professor();
        professor.setUsuarioId(usuarioId);
        professor.setPrimeiroAcesso(false);

        RedefinirSenhaRequestDTO request =
                new RedefinirSenhaRequestDTO(
                        "professor@teste.com",
                        "12345678900"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.of(professor));
        when(passwordEncoder.encode("12345678900"))
                .thenReturn("nova-senha-hash");
        when(usuarioRepository.save(usuario))
                .thenReturn(usuario);

        authService.redefinirSenha(request);

        assertEquals("nova-senha-hash", usuario.getSenha());
        assertEquals(true, professor.getPrimeiroAcesso());

        verify(passwordEncoder).encode("12345678900");
        verify(usuarioRepository).save(usuario);
        verify(professorRepository).save(professor);
    }

    @Test
    void deveRecusarRedefinicaoQuandoUsuarioNaoForEncontrado() {
        RedefinirSenhaRequestDTO request =
                new RedefinirSenhaRequestDTO(
                        "professor@teste.com",
                        "12345678900"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.redefinirSenha(request)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals(
                "Professor com email não cadastrado",
                exception.getReason()
        );

        verifyNoInteractions(professorRepository, passwordEncoder);
    }

    @Test
    void deveRecusarRedefinicaoQuandoProfessorNaoForEncontrado() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCpf("123.456.789-00");

        RedefinirSenhaRequestDTO request =
                new RedefinirSenhaRequestDTO(
                        "professor@teste.com",
                        "12345678900"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.redefinirSenha(request)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals(
                "Professor com email não cadastrado",
                exception.getReason()
        );

        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void deveRecusarRedefinicaoQuandoCpfForDiferente() {
        UUID usuarioId = UUID.randomUUID();

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setEmail("professor@teste.com");
        usuario.setCpf("123.456.789-00");

        Professor professor = new Professor();
        professor.setUsuarioId(usuarioId);

        RedefinirSenhaRequestDTO request =
                new RedefinirSenhaRequestDTO(
                        "professor@teste.com",
                        "987.654.321-00"
                );

        when(usuarioRepository.findByEmail("professor@teste.com"))
                .thenReturn(Optional.of(usuario));
        when(professorRepository.findByUsuarioId(usuarioId))
                .thenReturn(Optional.of(professor));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.redefinirSenha(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Dados inválidos", exception.getReason());

        verifyNoInteractions(passwordEncoder);
    }
}