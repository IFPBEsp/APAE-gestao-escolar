package com.apae.gestao.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.apae.gestao.dto.professor.EnderecoDTO;
import com.apae.gestao.dto.professor.ProfessorResumoDTO;
import com.apae.gestao.dto.professor.ProfessorSimplesDTO;
import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoDTO;
import com.apae.gestao.dto.turmaAluno.TurmaAlunoResponseDTO;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.security.JwtService;
import com.apae.gestao.service.TurmaService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(TurmaController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("TurmaController - Testes de Camada Web")
class TurmaControllerTest {

    private static final String BASE_URL = "/api/turmas";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TurmaService turmaService;

    // JwtAuthFilter é um @Component (Filter) e entra no slice WebMvcTest;
    // mesmo com addFilters = false o bean precisa ser criado, então mockamos a dependência dele.
    @MockBean
    private JwtService jwtService;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private TurmaRequestDTO requestValido() {
        return new TurmaRequestDTO(2025, "MANHA", true, "Educação Especial", Set.of(UUID.randomUUID()));
    }

    private ProfessorResumoDTO professorResumo(UUID id) {
        return new ProfessorResumoDTO(
                id, UUID.randomUUID(), "Maria da Silva", "12345678901", "maria.silva@apae.org.br", true,
                "(83) 99888-7766", "Licenciatura em Educação Especial",
                LocalDate.of(2024, 2, 1), LocalDate.of(1990, 5, 12),
                new EnderecoDTO("Alagoa Grande", "58388-000", "PB", "Centro", "Rua A", "10", null),
                false);
    }

    private ProfessorSimplesDTO professorSimples(UUID id) {
        return new ProfessorSimplesDTO(id, "Maria da Silva");
    }

    private TurmaResponseDTO turmaResponse(UUID id, boolean ativa) {
        TurmaResponseDTO r = new TurmaResponseDTO();
        r.setId(id);
        r.setNome("Alfabetização 2025 - Manhã");
        r.setAnoCriacao(2025);
        r.setTurno("MANHA");
        r.setTipo("Educação Especial");
        r.setAtiva(ativa);
        r.setAlunos(List.of(new TurmaAlunoResponseDTO(UUID.randomUUID(), "João Pedro", true)));
        r.setHorario("Segunda a Sexta - 8h as 12h");
        return r;
    }

    private String json(Object o) throws Exception {
        return objectMapper.writeValueAsString(o);
    }

    // ------------------------------------------------------------------
    // POST /api/turmas
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("POST /api/turmas")
    class Criar {

        @Test
        @DisplayName("Deve retornar 201 com a turma criada e repassar o DTO ao service")
        void deveRetornar201() throws Exception {
            UUID id = UUID.randomUUID();
            TurmaRequestDTO request = requestValido();
            when(turmaService.criar(any(TurmaRequestDTO.class))).thenReturn(turmaResponse(id, true));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.nome").value("Alfabetização 2025 - Manhã"))
                    .andExpect(jsonPath("$.anoCriacao").value(2025))
                    .andExpect(jsonPath("$.turno").value("MANHA"))
                    .andExpect(jsonPath("$.tipo").value("Educação Especial"))
                    .andExpect(jsonPath("$.ativa").value(true))
                    .andExpect(jsonPath("$.horario").value("Segunda a Sexta - 8h as 12h"))
                    .andExpect(jsonPath("$.alunos.length()").value(1))
                    .andExpect(jsonPath("$.alunos[0].nome").value("João Pedro"))
                    .andExpect(jsonPath("$.alunos[0].ativo").value(true));

            ArgumentCaptor<TurmaRequestDTO> captor = ArgumentCaptor.forClass(TurmaRequestDTO.class);
            verify(turmaService).criar(captor.capture());
            TurmaRequestDTO enviado = captor.getValue();
            assertThat(enviado.getAnoCriacao()).isEqualTo(2025);
            assertThat(enviado.getTurno()).isEqualTo("MANHA");
            assertThat(enviado.getTipo()).isEqualTo("Educação Especial");
            assertThat(enviado.getAlunosIds()).isEqualTo(request.getAlunosIds());
        }

        @Test
        @DisplayName("Deve retornar 201 apenas com os campos obrigatórios")
        void deveRetornar201ApenasObrigatorios() throws Exception {
            TurmaRequestDTO dto = new TurmaRequestDTO();
            dto.setAnoCriacao(2025);
            dto.setTurno("TARDE");
            dto.setTipo("Educação Especial");
            when(turmaService.criar(any(TurmaRequestDTO.class))).thenReturn(turmaResponse(UUID.randomUUID(), true));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Deve retornar 400 quando o ano de criação é nulo")
        void deveRetornar400SemAno() throws Exception {
            TurmaRequestDTO dto = requestValido();
            dto.setAnoCriacao(null);

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.errors.anoCriacao").exists());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o turno está em branco")
        void deveRetornar400TurnoEmBranco() throws Exception {
            TurmaRequestDTO dto = requestValido();
            dto.setTurno("  ");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.turno").exists());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o tipo está em branco")
        void deveRetornar400TipoEmBranco() throws Exception {
            TurmaRequestDTO dto = requestValido();
            dto.setTipo("");

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.tipo").value("Tipo é obrigatório"));

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 listando todos os campos obrigatórios quando o corpo é um objeto vazio")
        void deveRetornar400CorpoVazio() throws Exception {
            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.anoCriacao").exists())
                    .andExpect(jsonPath("$.errors.turno").exists())
                    .andExpect(jsonPath("$.errors.tipo").exists());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o JSON está malformado")
        void deveRetornar400JsonMalformado() throws Exception {
            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content("{turno: "))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando um ID de aluno não é um UUID válido")
        void deveRetornar400AlunoIdInvalido() throws Exception {
            String body = "{\"anoCriacao\":2025,\"turno\":\"MANHA\",\"tipo\":\"Educação Especial\",\"alunosIds\":[\"abc\"]}";

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve propagar o status do service (422) com a mensagem de erro")
        void devePropagarErroDoService() throws Exception {
            when(turmaService.criar(any(TurmaRequestDTO.class)))
                    .thenThrow(new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Turma inválida"));

            mockMvc.perform(post(BASE_URL).contentType(MediaType.APPLICATION_JSON).content(json(requestValido())))
                    .andExpect(status().isUnprocessableEntity())
                    .andExpect(jsonPath("$.status").value(422))
                    .andExpect(jsonPath("$.message").value("Turma inválida"));
        }
    }

    // ------------------------------------------------------------------
    // GET /api/turmas/{id}
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("GET /api/turmas/{id}")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar 200 com a turma resumida e repassar o PathVariable ao service")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            TurmaResumoDTO resumo = new TurmaResumoDTO(id, "Alfabetização 2025 - Manhã", 2025, "MANHA",
                    "Educação Especial", true, 25L, 23L, "Segunda a Sexta - 8h as 12h",
                    professorSimples(professorId));
            when(turmaService.buscarTurmaResumidaPorId(id)).thenReturn(resumo);

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.nome").value("Alfabetização 2025 - Manhã"))
                    .andExpect(jsonPath("$.anoCriacao").value(2025))
                    .andExpect(jsonPath("$.turno").value("MANHA"))
                    .andExpect(jsonPath("$.ativa").value(true))
                    .andExpect(jsonPath("$.totalAlunos").value(25))
                    .andExpect(jsonPath("$.totalAlunosAtivos").value(23))
                    .andExpect(jsonPath("$.horario").value("Segunda a Sexta - 8h as 12h"))
                    .andExpect(jsonPath("$.professor.id").value(professorId.toString()))
                    .andExpect(jsonPath("$.professor.nome").value("Maria da Silva"))
                    .andExpect(jsonPath("$.professor.cpf").doesNotExist())
                    .andExpect(jsonPath("$.professor.email").doesNotExist())
                    .andExpect(jsonPath("$.professor.telefone").doesNotExist())
                    .andExpect(jsonPath("$.professor.endereco").doesNotExist());

            verify(turmaService).buscarTurmaResumidaPorId(id);
        }

        @Test
        @DisplayName("Deve retornar 404 quando a turma não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.buscarTurmaResumidaPorId(id))
                    .thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Turma não encontrada"));
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o id não é um UUID")
        void deveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{id}", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }
    }

    // ------------------------------------------------------------------
    // GET /api/turmas
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("GET /api/turmas")
    class Listar {

        @Test
        @DisplayName("Deve retornar 200 com a lista e repassar filtros nulos quando não há query params")
        void deveRetornar200SemFiltros() throws Exception {
            UUID id = UUID.randomUUID();
            TurmaResumoDTO resumo = new TurmaResumoDTO(id, "Turma A", 2025, "TARDE", "Educação Especial",
                    true, 10L, 9L, "Segunda a Sexta - 14h as 18h", null);
            when(turmaService.listarTurmas(null, null, null, null, null, null)).thenReturn(List.of(resumo));

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].nome").value("Turma A"))
                    .andExpect(jsonPath("$[0].turno").value("TARDE"))
                    .andExpect(jsonPath("$[0].totalAlunos").value(10))
                    .andExpect(jsonPath("$[0].totalAlunosAtivos").value(9));

            verify(turmaService).listarTurmas(null, null, null, null, null, null);
        }

        @Test
        @DisplayName("Deve repassar id, nome, anoCriacao, turno, tipo e ativa dos query params ao service")
        void deveRepassarFiltros() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.listarTurmas(id, "Alfabetização", 2025, "MANHA", "Educação Especial", true))
                    .thenReturn(List.of());

            mockMvc.perform(get(BASE_URL)
                            .param("id", id.toString())
                            .param("nome", "Alfabetização")
                            .param("anoCriacao", "2025")
                            .param("turno", "MANHA")
                            .param("tipo", "Educação Especial")
                            .param("ativa", "true"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(turmaService).listarTurmas(id, "Alfabetização", 2025, "MANHA", "Educação Especial", true);
        }

        @Test
        @DisplayName("Deve retornar 200 com array vazio quando não há turmas")
        void deveRetornarListaVazia() throws Exception {
            when(turmaService.listarTurmas(null, null, null, null, null, null)).thenReturn(List.of());

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }

        @Test
        @DisplayName("Deve retornar 400 quando o query param id não é um UUID")
        void deveRetornar400IdInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL).param("id", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando anoCriacao não é numérico")
        void deveRetornar400AnoInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL).param("anoCriacao", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando ativa não é booleano")
        void deveRetornar400AtivaInvalida() throws Exception {
            mockMvc.perform(get(BASE_URL).param("ativa", "talvez"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }
    }

    // ------------------------------------------------------------------
    // PUT /api/turmas/{turmaId}
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("PUT /api/turmas/{turmaId}")
    class Atualizar {

        @Test
        @DisplayName("Deve retornar 200 com a turma atualizada e repassar id + body ao service")
        void deveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.atualizar(eq(id), any(TurmaRequestDTO.class))).thenReturn(turmaResponse(id, true));

            mockMvc.perform(put(BASE_URL + "/{turmaId}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.turno").value("MANHA"))
                    .andExpect(jsonPath("$.tipo").value("Educação Especial"));

            ArgumentCaptor<TurmaRequestDTO> captor = ArgumentCaptor.forClass(TurmaRequestDTO.class);
            verify(turmaService).atualizar(eq(id), captor.capture());
            assertThat(captor.getValue().getAnoCriacao()).isEqualTo(2025);
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o payload é inválido")
        void deveRetornar400PayloadInvalido() throws Exception {
            TurmaRequestDTO dto = requestValido();
            dto.setTurno("");
            dto.setTipo("");

            mockMvc.perform(put(BASE_URL + "/{turmaId}", UUID.randomUUID())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(dto)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.turno").exists())
                    .andExpect(jsonPath("$.errors.tipo").exists());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o id do path não é um UUID")
        void deveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(put(BASE_URL + "/{turmaId}", "abc")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 404 quando a turma não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.atualizar(eq(id), any(TurmaRequestDTO.class)))
                    .thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(put(BASE_URL + "/{turmaId}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("Turma não encontrada"));
        }
    }

    // ------------------------------------------------------------------
    // DELETE /api/turmas/{id}
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("DELETE /api/turmas/{id}")
    class Deletar {

        @Test
        @DisplayName("Deve retornar 204 sem corpo e repassar o id ao service")
        void deveRetornar204() throws Exception {
            UUID id = UUID.randomUUID();

            mockMvc.perform(delete(BASE_URL + "/{id}", id))
                    .andExpect(status().isNoContent())
                    .andExpect(content().string(""));

            verify(turmaService).deletarPorId(id);
        }

        @Test
        @DisplayName("Deve retornar 404 quando a turma não existe")
        void deveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            doThrow(new RecursoNaoEncontradoException("Turma não encontrada"))
                    .when(turmaService).deletarPorId(id);

            mockMvc.perform(delete(BASE_URL + "/{id}", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }

        @Test
        @DisplayName("Deve retornar 400 e não chamar o service quando o id não é um UUID")
        void deveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(delete(BASE_URL + "/{id}", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }
    }

    // ------------------------------------------------------------------
    // PATCH /api/turmas/{turmaId}/ativar | /desativar
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("PATCH /api/turmas/{turmaId}/ativar e /desativar")
    class AtivarDesativar {

        @Test
        @DisplayName("ativar: deve retornar 200 com ativa=true")
        void ativarDeveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.ativarTurma(id)).thenReturn(turmaResponse(id, true));

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/ativar", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.ativa").value(true));

            verify(turmaService).ativarTurma(id);
        }

        @Test
        @DisplayName("ativar: deve retornar 404 quando a turma não existe")
        void ativarDeveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.ativarTurma(id)).thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/ativar", id))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("ativar: deve retornar 400 quando o id não é um UUID")
        void ativarDeveRetornar400() throws Exception {
            mockMvc.perform(patch(BASE_URL + "/{turmaId}/ativar", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("desativar: deve retornar 200 com ativa=false")
        void desativarDeveRetornar200() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.desativarTurma(id)).thenReturn(turmaResponse(id, false));

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/desativar", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.ativa").value(false));

            verify(turmaService).desativarTurma(id);
        }

        @Test
        @DisplayName("desativar: deve retornar 404 quando a turma não existe")
        void desativarDeveRetornar404() throws Exception {
            UUID id = UUID.randomUUID();
            when(turmaService.desativarTurma(id)).thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/desativar", id))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("desativar: deve retornar 400 quando o id não é um UUID")
        void desativarDeveRetornar400() throws Exception {
            mockMvc.perform(patch(BASE_URL + "/{turmaId}/desativar", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }
    }

    // ------------------------------------------------------------------
    // PUT /api/turmas/{turmaId}/professor/{professorId}
    // DELETE /api/turmas/{turmaId}/professor
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("Vínculo de professor")
    class VinculoProfessor {

        @Test
        @DisplayName("PUT: deve retornar 200 com o professor vinculado e repassar os dois PathVariables")
        void adicionarDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            TurmaResponseDTO resposta = turmaResponse(turmaId, true);
            resposta.setProfessor(professorResumo(professorId));
            when(turmaService.adicionarProfessor(turmaId, professorId)).thenReturn(resposta);

            mockMvc.perform(put(BASE_URL + "/{turmaId}/professor/{professorId}", turmaId, professorId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(turmaId.toString()))
                    .andExpect(jsonPath("$.professor.id").value(professorId.toString()))
                    .andExpect(jsonPath("$.professor.nome").value("Maria da Silva"));

            verify(turmaService).adicionarProfessor(turmaId, professorId);
        }

        @Test
        @DisplayName("PUT: deve retornar 404 quando a turma ou o professor não existe")
        void adicionarDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            when(turmaService.adicionarProfessor(turmaId, professorId))
                    .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));

            mockMvc.perform(put(BASE_URL + "/{turmaId}/professor/{professorId}", turmaId, professorId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("Professor não encontrado"));
        }

        @Test
        @DisplayName("PUT: deve retornar 400 quando algum dos ids não é um UUID")
        void adicionarDeveRetornar400() throws Exception {
            mockMvc.perform(put(BASE_URL + "/{turmaId}/professor/{professorId}", UUID.randomUUID(), "abc"))
                    .andExpect(status().isBadRequest());

            mockMvc.perform(put(BASE_URL + "/{turmaId}/professor/{professorId}", "abc", UUID.randomUUID()))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("DELETE: deve retornar 200 com a turma sem professor")
        void removerDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.removerProfessor(turmaId)).thenReturn(turmaResponse(turmaId, true));

            mockMvc.perform(delete(BASE_URL + "/{turmaId}/professor", turmaId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(turmaId.toString()))
                    .andExpect(jsonPath("$.professor").doesNotExist());

            verify(turmaService).removerProfessor(turmaId);
        }

        @Test
        @DisplayName("DELETE: deve retornar 404 quando a turma não existe")
        void removerDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.removerProfessor(turmaId))
                    .thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(delete(BASE_URL + "/{turmaId}/professor", turmaId))
                    .andExpect(status().isNotFound());
        }
    }

    // ------------------------------------------------------------------
    // POST /api/turmas/{turmaId}/alunos
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("POST /api/turmas/{turmaId}/alunos")
    class AdicionarAlunos {

        @Test
        @DisplayName("Deve retornar 200 e repassar o id da turma e a lista de alunos ao service")
        void deveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            List<UUID> alunos = List.of(UUID.randomUUID(), UUID.randomUUID());
            when(turmaService.adicionarAlunos(turmaId, alunos)).thenReturn(turmaResponse(turmaId, true));

            mockMvc.perform(post(BASE_URL + "/{turmaId}/alunos", turmaId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(alunos)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(turmaId.toString()))
                    .andExpect(jsonPath("$.alunos.length()").value(1));

            verify(turmaService).adicionarAlunos(turmaId, alunos);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o corpo não é uma lista de UUIDs válidos")
        void deveRetornar400CorpoInvalido() throws Exception {
            mockMvc.perform(post(BASE_URL + "/{turmaId}/alunos", UUID.randomUUID())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("[\"abc\"]"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o corpo está ausente")
        void deveRetornar400SemCorpo() throws Exception {
            mockMvc.perform(post(BASE_URL + "/{turmaId}/alunos", UUID.randomUUID())
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 400 quando o id da turma não é um UUID")
        void deveRetornar400TurmaIdInvalido() throws Exception {
            mockMvc.perform(post(BASE_URL + "/{turmaId}/alunos", "abc")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(List.of(UUID.randomUUID()))))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("Deve retornar 422 quando o service recusa adicionar aluno em turma inativa")
        void deveRetornar422TurmaInativa() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.adicionarAlunos(eq(turmaId), any()))
                    .thenThrow(new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                            "Não é possível adicionar aluno em uma turma inativa"));

            mockMvc.perform(post(BASE_URL + "/{turmaId}/alunos", turmaId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(List.of(UUID.randomUUID()))))
                    .andExpect(status().isUnprocessableEntity())
                    .andExpect(jsonPath("$.status").value(422))
                    .andExpect(jsonPath("$.message").value("Não é possível adicionar aluno em uma turma inativa"));
        }

        @Test
        @DisplayName("Deve retornar 400 com a mensagem quando o service lança falha de negócio (RuntimeException)")
        void deveRetornar400FalhaDeNegocio() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.adicionarAlunos(eq(turmaId), any()))
                    .thenThrow(new RuntimeException("Um ou mais IDs de aluno não foram encontrados."));

            mockMvc.perform(post(BASE_URL + "/{turmaId}/alunos", turmaId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(List.of(UUID.randomUUID()))))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Um ou mais IDs de aluno não foram encontrados."));
        }
    }

    // ------------------------------------------------------------------
    // GET /api/turmas/{turmaId}/alunos | /ativos | /inativos
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("GET alunos da turma")
    class ListarAlunos {

        private TurmaAlunoResponseDTO aluno(String nome, boolean ativo) {
            return new TurmaAlunoResponseDTO(UUID.randomUUID(), nome, ativo);
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos: deve retornar 200 com todos os alunos (ativos e inativos)")
        void listarTodosDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunos(turmaId))
                    .thenReturn(List.of(aluno("João", true), aluno("Ana", false)));

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos", turmaId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].nome").value("João"))
                    .andExpect(jsonPath("$[0].ativo").value(true))
                    .andExpect(jsonPath("$[1].nome").value("Ana"))
                    .andExpect(jsonPath("$[1].ativo").value(false));

            verify(turmaService).listarAlunos(turmaId);
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos: deve retornar 404 quando a turma não existe")
        void listarTodosDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunos(turmaId))
                    .thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos", turmaId))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos: deve retornar 400 quando o id não é um UUID")
        void listarTodosDeveRetornar400() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos", "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos/ativos: deve retornar 200 apenas com alunos ativos")
        void listarAtivosDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunosAtivos(turmaId)).thenReturn(List.of(aluno("João", true)));

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos/ativos", turmaId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].ativo").value(true));

            verify(turmaService).listarAlunosAtivos(turmaId);
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos/ativos: deve retornar 404 quando a turma não existe")
        void listarAtivosDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunosAtivos(turmaId))
                    .thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos/ativos", turmaId))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos/inativos: deve retornar 200 apenas com alunos inativos")
        void listarInativosDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunosInativos(turmaId)).thenReturn(List.of(aluno("Ana", false)));

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos/inativos", turmaId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].ativo").value(false));

            verify(turmaService).listarAlunosInativos(turmaId);
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos/inativos: deve retornar 200 com array vazio quando não há inativos")
        void listarInativosDeveRetornarVazio() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunosInativos(turmaId)).thenReturn(List.of());

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos/inativos", turmaId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }

        @Test
        @DisplayName("GET /{turmaId}/alunos/inativos: deve retornar 404 quando a turma não existe")
        void listarInativosDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            when(turmaService.listarAlunosInativos(turmaId))
                    .thenThrow(new RecursoNaoEncontradoException("Turma não encontrada"));

            mockMvc.perform(get(BASE_URL + "/{turmaId}/alunos/inativos", turmaId))
                    .andExpect(status().isNotFound());
        }
    }

    // ------------------------------------------------------------------
    // PATCH /api/turmas/{turmaId}/alunos/{alunoId}/ativar | /inativar
    // ------------------------------------------------------------------

    @Nested
    @DisplayName("PATCH vínculo de aluno na turma")
    class AtivarInativarAluno {

        @Test
        @DisplayName("ativar: deve retornar 200 sem corpo e repassar turmaId e alunoId ao service")
        void ativarDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/ativar", turmaId, alunoId))
                    .andExpect(status().isOk())
                    .andExpect(content().string(""));

            verify(turmaService).ativarAluno(turmaId, alunoId);
        }

        @Test
        @DisplayName("ativar: deve retornar 404 quando o vínculo não existe")
        void ativarDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            doThrow(new RecursoNaoEncontradoException("Turma não encontrada"))
                    .when(turmaService).ativarAluno(turmaId, alunoId);

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/ativar", turmaId, alunoId))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("ativar: deve retornar 400 com falha de negócio quando o aluno não pertence à turma")
        void ativarDeveRetornar400AlunoForaDaTurma() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            doThrow(new RuntimeException("O aluno não pertence a esta turma."))
                    .when(turmaService).ativarAluno(turmaId, alunoId);

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/ativar", turmaId, alunoId))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("O aluno não pertence a esta turma."));
        }

        @Test
        @DisplayName("ativar: deve retornar 400 quando algum id não é um UUID")
        void ativarDeveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/ativar", UUID.randomUUID(), "abc"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }

        @Test
        @DisplayName("inativar: deve retornar 200 sem corpo e repassar turmaId e alunoId ao service")
        void inativarDeveRetornar200() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/inativar", turmaId, alunoId))
                    .andExpect(status().isOk())
                    .andExpect(content().string(""));

            verify(turmaService).desativarAluno(turmaId, alunoId);
        }

        @Test
        @DisplayName("inativar: deve retornar 404 quando o vínculo não existe")
        void inativarDeveRetornar404() throws Exception {
            UUID turmaId = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            doThrow(new RecursoNaoEncontradoException("Turma não encontrada"))
                    .when(turmaService).desativarAluno(turmaId, alunoId);

            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/inativar", turmaId, alunoId))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("inativar: deve retornar 400 quando algum id não é um UUID")
        void inativarDeveRetornar400UuidInvalido() throws Exception {
            mockMvc.perform(patch(BASE_URL + "/{turmaId}/alunos/{alunoId}/inativar", "abc", UUID.randomUUID()))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(turmaService);
        }
    }
}