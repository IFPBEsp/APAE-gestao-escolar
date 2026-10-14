package com.apae.gestao.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.apae.gestao.dto.professor.EnderecoDTO;
import com.apae.gestao.dto.professor.ProfessorListagemDTO;
import com.apae.gestao.dto.professor.ProfessorRequestDTO;
import com.apae.gestao.dto.professor.ProfessorResponseDTO;
import com.apae.gestao.dto.professor.ProfessorResumoDTO;
import com.apae.gestao.exception.ConflitoDeDadosException;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.security.JwtService;
import com.apae.gestao.service.ProfessorService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(ProfessorController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("ProfessorController - Testes de Camada Web")
class ProfessorControllerTest {

    private static final String BASE_URL = "/api/professores";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfessorService professorService;

    @MockBean
    private JwtService jwtService;

    @BeforeEach
    void resetMocks() {
        Mockito.reset(professorService);
    }

    private ProfessorRequestDTO requestValido() {
        ProfessorRequestDTO dto = new ProfessorRequestDTO();
        dto.setNome("Maria da Silva");
        dto.setCpf("12345678901");
        dto.setEmail("maria.silva@apae.org.br");
        dto.setTelefone("(83) 99888-7766");
        dto.setDataNascimento(LocalDate.of(1990, 5, 12));
        dto.setFormacao("Licenciatura em Educação Especial");
        dto.setDataContratacao(LocalDate.of(2024, 2, 1));
        dto.setEndereco(new EnderecoDTO("Alagoa Grande", "58388-000", "PB", "Centro", "Rua A", "10", null));
        dto.setAtivo(true);
        return dto;
    }

    private ProfessorResponseDTO responseDe(UUID id, boolean ativo) {
        ProfessorResponseDTO r = new ProfessorResponseDTO();
        r.setId(id);
        r.setUsuarioId(UUID.randomUUID());
        r.setNome("Maria da Silva");
        r.setCpf("12345678901");
        r.setEmail("maria.silva@apae.org.br");
        r.setTelefone("(83) 99888-7766");
        r.setDataNascimento(LocalDate.of(1990, 5, 12));
        r.setFormacao("Licenciatura em Educação Especial");
        r.setDataContratacao(LocalDate.of(2024, 2, 1));
        r.setEndereco(new EnderecoDTO("Alagoa Grande", "58388-000", "PB", "Centro", "Rua A", "10", null));
        r.setAtivo(ativo);
        r.setPrimeiroAcesso(true);
        return r;
    }

    private String json(Object o) throws Exception {
        return objectMapper.writeValueAsString(o);
    }

    @Nested
    @DisplayName("GET /api/professores")
    class Listar {

        @Test
        @DisplayName("Deve retornar 200 com a lista serializada e repassar filtros nulos quando não há query params")
        void deveRetornar200SemFiltros() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.listarProfessores(null, null, null, null))
                    .thenReturn(List.of(new ProfessorListagemDTO(id, true, "Maria", "maria@apae.org.br", "1º Ano A, 2º Ano B")));

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].ativo").value(true))
                    .andExpect(jsonPath("$[0].nome").value("Maria"))
                    .andExpect(jsonPath("$[0].email").value("maria@apae.org.br"))
                    .andExpect(jsonPath("$[0].turmas").value("1º Ano A, 2º Ano B"));

            verify(professorService).listarProfessores(null, null, null, null);
        }

        @Test
        @DisplayName("Deve repassar id, nome, email e ativo dos query params ao service")
        void deveRepassarFiltros() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.listarProfessores(id, "Maria", "maria@apae.org.br", false))
                    .thenReturn(List.of());

            mockMvc.perform(get(BASE_URL)
                            .param("id", id.toString())
                            .param("nome", "Maria")
                            .param("email", "maria@apae.org.br")
                            .param("ativo", "false"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(professorService).listarProfessores(id, "Maria", "maria@apae.org.br", false);
        }

        @Test
        @DisplayName("Deve retornar 200 com array vazio quando o service não encontra professores")
        void deveRetornarListaVazia() throws Exception {
            when(professorService.listarProfessores(null, null, null, null)).thenReturn(List.of());

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }

        @Test
        @DisplayName("Deve retornar 400 quando o query param id não é um UUID válido")
        void deveRetornar400ParaUuidInvalidoNoFiltro() throws Exception {
            mockMvc.perform(get(BASE_URL).param("id", "nao-e-uuid"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }
    }

    @Nested
    @DisplayName("GET /api/professores/{id}")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar 200 com o DTO resumido e repassar o PathVariable ao service")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            UUID usuarioId = UUID.randomUUID();
            ProfessorResumoDTO resumo = new ProfessorResumoDTO(
                    id, usuarioId, "Maria da Silva", "12345678901", "maria.silva@apae.org.br", true,
                    "(83) 99888-7766", "Licenciatura em Educação Especial",
                    LocalDate.of(2024, 2, 1), LocalDate.of(1990, 5, 12),
                    new EnderecoDTO("Alagoa Grande", "58388-000", "PB", "Centro", "Rua A", "10", null),
                    false);
            when(professorService.buscarPorIdResumido(id)).thenReturn(resumo);

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.usuarioId").value(usuarioId.toString()))
                    .andExpect(jsonPath("$.nome").value("Maria da Silva"))
                    .andExpect(jsonPath("$.cpf").value("12345678901"))
                    .andExpect(jsonPath("$.ativo").value(true))
                    .andExpect(jsonPath("$.dataContratacao").value("2024-02-01"))
                    .andExpect(jsonPath("$.dataNascimento").value("1990-05-12"))
                    .andExpect(jsonPath("$.endereco.cidade").value("Alagoa Grande"))
                    .andExpect(jsonPath("$.primeiroAcesso").value(false));

            verify(professorService).buscarPorIdResumido(id);
        }

        @Test
        @DisplayName("Deve retornar 404 quando o professor não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.buscarPorIdResumido(id))
                    .thenThrow(new RecursoNaoEncontradoException("Professor não encontrado"));

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Professor não encontrado"));
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o id não é um UUID")
        void deveRetornar400ParaUuidInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{id}", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }
    }

    @Nested
    @DisplayName("GET /api/professores/completo?id={id}")
    class BuscarCompleto {

        @Test
        @DisplayName("Deve retornar 200 com o DTO completo e repassar o RequestParam ao service")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.buscarPorId(id)).thenReturn(responseDe(id, true));

            mockMvc.perform(get(BASE_URL + "/completo").param("id", id.toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.nome").value("Maria da Silva"))
                    .andExpect(jsonPath("$.email").value("maria.silva@apae.org.br"))
                    .andExpect(jsonPath("$.formacao").value("Licenciatura em Educação Especial"))
                    .andExpect(jsonPath("$.dataNascimento").value("1990-05-12"))
                    .andExpect(jsonPath("$.dataContratacao").value("2024-02-01"))
                    .andExpect(jsonPath("$.endereco.estado").value("PB"))
                    .andExpect(jsonPath("$.ativo").value(true))
                    .andExpect(jsonPath("$.primeiroAcesso").value(true));

            verify(professorService).buscarPorId(id);
            // garante que /completo NÃO foi roteado para /{id}
            verify(professorService, times(0)).buscarPorIdResumido(any());
        }

        @Test
        @DisplayName("Deve retornar 404 quando o professor não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.buscarPorId(id))
                    .thenThrow(new RecursoNaoEncontradoException("Professor não encontrado"));

            mockMvc.perform(get(BASE_URL + "/completo").param("id", id.toString()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o id não é um UUID")
        void deveRetornar400ParaUuidInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL + "/completo").param("id", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }
    }

    @Nested
    @DisplayName("POST /api/professores")
    class Criar {

        @Test
        @DisplayName("Deve retornar 201 com o professor criado quando o payload é válido")
        void deveRetornar201() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.criar(any(ProfessorRequestDTO.class))).thenReturn(responseDe(id, true));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.nome").value("Maria da Silva"))
                    .andExpect(jsonPath("$.cpf").value("12345678901"))
                    .andExpect(jsonPath("$.ativo").value(true))
                    .andExpect(jsonPath("$.primeiroAcesso").value(true));

            ArgumentCaptor<ProfessorRequestDTO> captor = ArgumentCaptor.forClass(ProfessorRequestDTO.class);
            verify(professorService).criar(captor.capture());
            ProfessorRequestDTO enviado = captor.getValue();
            org.assertj.core.api.Assertions.assertThat(enviado.getNome()).isEqualTo("Maria da Silva");
            org.assertj.core.api.Assertions.assertThat(enviado.getDataContratacao()).isEqualTo(LocalDate.of(2024, 2, 1));
            org.assertj.core.api.Assertions.assertThat(enviado.getEndereco().getCidade()).isEqualTo("Alagoa Grande");
        }

        @Test
        @DisplayName("Deve retornar 201 apenas com os campos obrigatórios")
        void deveRetornar201ApenasObrigatorios() throws Exception {
            ProfessorRequestDTO dto = new ProfessorRequestDTO();
            dto.setNome("João");
            dto.setCpf("12345678901");
            dto.setEmail("joao@apae.org.br");
            dto.setDataContratacao(LocalDate.of(2024, 2, 1));
            when(professorService.criar(any(ProfessorRequestDTO.class)))
                    .thenReturn(responseDe(UUID.randomUUID(), true));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(dto)))
                    .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Deve retornar 400 com erro por campo quando o nome está em branco")
        void deveRetornar400NomeEmBranco() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setNome("  ");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.errors.nome").value("Nome é obrigatório"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o nome excede 100 caracteres")
        void deveRetornar400NomeMuitoLongo() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setNome("A".repeat(101));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.nome").value("Nome deve ter no máximo 100 caracteres"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o CPF está em branco")
        void deveRetornar400CpfEmBranco() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setCpf("");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.cpf").exists());

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o CPF tem menos de 11 caracteres")
        void deveRetornar400CpfCurto() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setCpf("123");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.cpf").value("CPF deve ter entre 11 e 14 caracteres"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o CPF tem mais de 14 caracteres")
        void deveRetornar400CpfLongo() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setCpf("123456789012345");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.cpf").value("CPF deve ter entre 11 e 14 caracteres"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o e-mail está em branco")
        void deveRetornar400EmailEmBranco() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setEmail("");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.email").exists());

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o e-mail é inválido")
        void deveRetornar400EmailInvalido() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setEmail("email-invalido");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.email").value("Email deve ser válido"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o telefone excede 15 caracteres")
        void deveRetornar400TelefoneLongo() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setTelefone("1".repeat(16));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.telefone").value("Telefone deve ter no máximo 15 caracteres"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando a formação excede 100 caracteres")
        void deveRetornar400FormacaoLonga() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setFormacao("F".repeat(101));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.formacao").value("Formação deve ter no máximo 100 caracteres"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando a data de contratação é nula")
        void deveRetornar400SemDataContratacao() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.setDataContratacao(null);

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.dataContratacao").value("Data de contratação é obrigatória"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve validar o endereço aninhado (@Valid) e retornar 400 quando um campo excede 255 caracteres")
        void deveRetornar400EnderecoInvalido() throws Exception {
            ProfessorRequestDTO dto = requestValido();
            dto.getEndereco().setCidade("C".repeat(256));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors['endereco.cidade']")
                            .value("Cidade deve ter no máximo 255 caracteres"));

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 listando todos os campos inválidos quando o corpo é um objeto vazio")
        void deveRetornar400CorpoVazio() throws Exception {
            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.nome").exists())
                    .andExpect(jsonPath("$.errors.cpf").exists())
                    .andExpect(jsonPath("$.errors.email").exists())
                    .andExpect(jsonPath("$.errors.dataContratacao").exists());

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o JSON está malformado")
        void deveRetornar400JsonMalformado() throws Exception {
            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content("{nome: "))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 409 quando o service sinaliza CPF/e-mail já cadastrado")
        void deveRetornar409EmConflito() throws Exception {
            when(professorService.criar(any(ProfessorRequestDTO.class)))
                    .thenThrow(new ConflitoDeDadosException("Já existe um usuário cadastrado com este CPF"));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(requestValido())))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409))
                    .andExpect(jsonPath("$.message").value("Já existe um usuário cadastrado com este CPF"));
        }
    }

    @Nested
    @DisplayName("PUT /api/professores/{id}")
    class Atualizar {

        @Test
        @DisplayName("Deve retornar 200 com o professor atualizado e repassar id + body ao service")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.atualizar(eq(id), any(ProfessorRequestDTO.class)))
                    .thenReturn(responseDe(id, true));

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.nome").value("Maria da Silva"))
                    .andExpect(jsonPath("$.email").value("maria.silva@apae.org.br"));

            ArgumentCaptor<ProfessorRequestDTO> captor = ArgumentCaptor.forClass(ProfessorRequestDTO.class);
            verify(professorService).atualizar(eq(id), captor.capture());
            org.assertj.core.api.Assertions.assertThat(captor.getValue().getCpf()).isEqualTo("12345678901");
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o payload é inválido")
        void deveRetornar400PayloadInvalido() throws Exception {
            UUID id = UUID.randomUUID();
            ProfessorRequestDTO dto = requestValido();
            dto.setEmail("invalido");
            dto.setNome("");

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.email").exists())
                    .andExpect(jsonPath("$.errors.nome").exists());

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o id do path não é um UUID")
        void deveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(put(BASE_URL + "/{id}", "abc")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }

        @Test
        @DisplayName("Deve retornar 404 quando o professor não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.atualizar(eq(id), any(ProfessorRequestDTO.class)))
                    .thenThrow(new RecursoNaoEncontradoException("Professor não encontrado"));

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("Professor não encontrado"));
        }

        @Test
        @DisplayName("Deve retornar 409 quando o service sinaliza conflito de dados")
        void deveRetornar409() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.atualizar(eq(id), any(ProfessorRequestDTO.class)))
                    .thenThrow(new ConflitoDeDadosException("Já existe um usuário cadastrado com este e-mail"));

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409));
        }
    }

    @Nested
    @DisplayName("PATCH /api/professores/{id}/inativar")
    class Inativar {

        @Test
        @DisplayName("Deve retornar 200 com ativo=false")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.inativar(id)).thenReturn(responseDe(id, false));

            mockMvc.perform(patch(BASE_URL + "/{id}/inativar", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.ativo").value(false));

            verify(professorService).inativar(id);
        }

        @Test
        @DisplayName("Deve retornar 404 quando o professor não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.inativar(id))
                    .thenThrow(new RecursoNaoEncontradoException("Professor não encontrado"));

            mockMvc.perform(patch(BASE_URL + "/{id}/inativar", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o id não é um UUID")
        void deveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(patch(BASE_URL + "/{id}/inativar", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }
    }

    @Nested
    @DisplayName("PATCH /api/professores/{id}/ativar")
    class Reativar {

        @Test
        @DisplayName("Deve retornar 200 com ativo=true")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.reativarProfessor(id)).thenReturn(responseDe(id, true));

            mockMvc.perform(patch(BASE_URL + "/{id}/ativar", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.ativo").value(true));

            verify(professorService).reativarProfessor(id);
        }

        @Test
        @DisplayName("Deve retornar 404 quando o professor não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(professorService.reativarProfessor(id))
                    .thenThrow(new RecursoNaoEncontradoException("Professor não encontrado"));

            mockMvc.perform(patch(BASE_URL + "/{id}/ativar", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o id não é um UUID")
        void deveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(patch(BASE_URL + "/{id}/ativar", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(professorService);
        }
    }
}