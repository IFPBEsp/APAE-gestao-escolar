package com.apae.gestao.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.apae.gestao.dto.avaliacao.AvaliacaoRequestDTO;
import com.apae.gestao.dto.avaliacao.AvaliacaoResponseDTO;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.security.JwtService;
import com.apae.gestao.service.AvaliacaoService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AvaliacaoController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("AvaliacaoController - Testes de Camada Web")
class AvaliacaoControllerTest {

    private static final String BASE_URL = "/api/avaliacoes";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AvaliacaoService avaliacaoService;

    @MockBean
    private JwtService jwtService;

    private AvaliacaoRequestDTO requestValido() {
        return new AvaliacaoRequestDTO("Aluno apresentou excelente evolução pedagógica.", UUID.randomUUID(), UUID.randomUUID());
    }

    private AvaliacaoResponseDTO responseValido(UUID id, UUID alunoId, UUID professorId) {
        return AvaliacaoResponseDTO.builder()
                .id(id)
                .descricao("Aluno apresentou excelente evolução pedagógica.")
                .alunoId(alunoId)
                .alunoNome("João da Silva")
                .professorId(professorId)
                .professorNome("Maria Professora")
                .dataAvaliacao(LocalDateTime.now())
                .turmaNomeCompleto("Turma A - MANHA")
                .build();
    }

    private String json(Object o) throws Exception {
        return objectMapper.writeValueAsString(o);
    }

    @Nested
    @DisplayName("POST /api/avaliacoes")
    class Criar {

        @Test
        @DisplayName("Deve retornar 201 Created quando o payload for válido")
        void deveRetornar201QuandoPayloadValido() throws Exception {
            UUID id = UUID.randomUUID();
            AvaliacaoRequestDTO request = requestValido();
            AvaliacaoResponseDTO response = responseValido(id, request.getAlunoId(), request.getProfessorId());

            when(avaliacaoService.criar(any(AvaliacaoRequestDTO.class))).thenReturn(response);

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.descricao").value(response.getDescricao()))
                    .andExpect(jsonPath("$.alunoId").value(request.getAlunoId().toString()))
                    .andExpect(jsonPath("$.alunoNome").value(response.getAlunoNome()))
                    .andExpect(jsonPath("$.professorId").value(request.getProfessorId().toString()))
                    .andExpect(jsonPath("$.professorNome").value(response.getProfessorNome()))
                    .andExpect(jsonPath("$.turmaNomeCompleto").value(response.getTurmaNomeCompleto()));

            ArgumentCaptor<AvaliacaoRequestDTO> captor = ArgumentCaptor.forClass(AvaliacaoRequestDTO.class);
            verify(avaliacaoService).criar(captor.capture());
            AvaliacaoRequestDTO enviado = captor.getValue();
            assertThat(enviado.getDescricao()).isEqualTo(request.getDescricao());
            assertThat(enviado.getAlunoId()).isEqualTo(request.getAlunoId());
            assertThat(enviado.getProfessorId()).isEqualTo(request.getProfessorId());
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando a descrição for nula")
        void deveRetornar400QuandoDescricaoNula() throws Exception {
            AvaliacaoRequestDTO request = requestValido();
            request.setDescricao(null);

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.errors.descricao").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando a descrição estiver em branco")
        void deveRetornar400QuandoDescricaoEmBranco() throws Exception {
            AvaliacaoRequestDTO request = requestValido();
            request.setDescricao("   ");

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.descricao").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o alunoId for nulo")
        void deveRetornar400QuandoAlunoIdNulo() throws Exception {
            AvaliacaoRequestDTO request = requestValido();
            request.setAlunoId(null);

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.alunoId").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o professorId for nulo")
        void deveRetornar400QuandoProfessorIdNulo() throws Exception {
            AvaliacaoRequestDTO request = requestValido();
            request.setProfessorId(null);

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.professorId").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando a descrição ultrapassar 2000 caracteres")
        void deveRetornar400QuandoDescricaoMuitoLonga() throws Exception {
            AvaliacaoRequestDTO request = requestValido();
            request.setDescricao("a".repeat(2001));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.descricao").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o corpo for um objeto vazio")
        void deveRetornar400QuandoCorpoVazio() throws Exception {
            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.descricao").exists())
                    .andExpect(jsonPath("$.errors.alunoId").exists())
                    .andExpect(jsonPath("$.errors.professorId").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o JSON for malformado")
        void deveRetornar400QuandoJsonMalformado() throws Exception {
            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{descricao: "))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(avaliacaoService);
        }
    }

    @Nested
    @DisplayName("GET /api/avaliacoes")
    class ListarTodas {

        @Test
        @DisplayName("Deve retornar 200 OK com lista de avaliações quando houver registros")
        void deveRetornar200ComListaDeAvaliacoes() throws Exception {
            UUID id = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            AvaliacaoResponseDTO response = responseValido(id, alunoId, professorId);

            when(avaliacaoService.listarTodas()).thenReturn(List.of(response));

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].descricao").value(response.getDescricao()))
                    .andExpect(jsonPath("$[0].alunoId").value(alunoId.toString()))
                    .andExpect(jsonPath("$[0].alunoNome").value(response.getAlunoNome()))
                    .andExpect(jsonPath("$[0].professorId").value(professorId.toString()))
                    .andExpect(jsonPath("$[0].professorNome").value(response.getProfessorNome()))
                    .andExpect(jsonPath("$[0].turmaNomeCompleto").value(response.getTurmaNomeCompleto()));

            verify(avaliacaoService).listarTodas();
        }

        @Test
        @DisplayName("Deve retornar 200 OK com array vazio quando não houver avaliações cadastradas")
        void deveRetornar200ComListaVazia() throws Exception {
            when(avaliacaoService.listarTodas()).thenReturn(List.of());

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(avaliacaoService).listarTodas();
        }
    }

    @Nested
    @DisplayName("GET /api/avaliacoes/{id}")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar 200 OK com a avaliação correspondente quando o ID existir")
        void deveRetornar200QuandoIdExistir() throws Exception {
            UUID id = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            AvaliacaoResponseDTO response = responseValido(id, alunoId, professorId);

            when(avaliacaoService.buscarPorId(id)).thenReturn(response);

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.descricao").value(response.getDescricao()))
                    .andExpect(jsonPath("$.alunoId").value(alunoId.toString()))
                    .andExpect(jsonPath("$.alunoNome").value(response.getAlunoNome()))
                    .andExpect(jsonPath("$.professorId").value(professorId.toString()))
                    .andExpect(jsonPath("$.professorNome").value(response.getProfessorNome()));

            verify(avaliacaoService).buscarPorId(id);
        }

        @Test
        @DisplayName("Deve retornar 404 Not Found quando a avaliação não for encontrada por ID")
        void deveRetornar404QuandoNaoEncontrada() throws Exception {
            UUID id = UUID.randomUUID();
            when(avaliacaoService.buscarPorId(id))
                    .thenThrow(new RecursoNaoEncontradoException("Avaliação não encontrada"));

            mockMvc.perform(get(BASE_URL + "/{id}", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Avaliação não encontrada"));

            verify(avaliacaoService).buscarPorId(id);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o ID no caminho não for um UUID válido")
        void deveRetornar400QuandoIdInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{id}", "id-invalido"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(avaliacaoService);
        }
    }

    @Nested
    @DisplayName("GET /api/avaliacoes/alunos/{alunoId}")
    class ListarPorAluno {

        @Test
        @DisplayName("Deve retornar 200 OK com a lista de avaliações do aluno quando o alunoId for válido")
        void deveRetornar200QuandoAlunoIdValido() throws Exception {
            UUID id = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            AvaliacaoResponseDTO response = responseValido(id, alunoId, professorId);

            when(avaliacaoService.listarPorAluno(alunoId)).thenReturn(List.of(response));

            mockMvc.perform(get(BASE_URL + "/alunos/{alunoId}", alunoId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].alunoId").value(alunoId.toString()))
                    .andExpect(jsonPath("$[0].alunoNome").value(response.getAlunoNome()));

            verify(avaliacaoService).listarPorAluno(alunoId);
        }

        @Test
        @DisplayName("Deve retornar 404 Not Found quando o aluno não for encontrado")
        void deveRetornar404QuandoAlunoNaoEncontrado() throws Exception {
            UUID alunoId = UUID.randomUUID();
            when(avaliacaoService.listarPorAluno(alunoId))
                    .thenThrow(new RecursoNaoEncontradoException("Aluno não encontrado"));

            mockMvc.perform(get(BASE_URL + "/alunos/{alunoId}", alunoId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Aluno não encontrado"));

            verify(avaliacaoService).listarPorAluno(alunoId);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o alunoId não for um UUID válido")
        void deveRetornar400QuandoAlunoIdInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL + "/alunos/{alunoId}", "aluno-invalido"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(avaliacaoService);
        }
    }

    @Nested
    @DisplayName("GET /api/avaliacoes/professores/{professorId}")
    class ListarPorProfessor {

        @Test
        @DisplayName("Deve retornar 200 OK com a lista de avaliações do professor quando o professorId for válido")
        void deveRetornar200QuandoProfessorIdValido() throws Exception {
            UUID id = UUID.randomUUID();
            UUID alunoId = UUID.randomUUID();
            UUID professorId = UUID.randomUUID();
            AvaliacaoResponseDTO response = responseValido(id, alunoId, professorId);

            when(avaliacaoService.listarPorProfessor(professorId)).thenReturn(List.of(response));

            mockMvc.perform(get(BASE_URL + "/professores/{professorId}", professorId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].professorId").value(professorId.toString()))
                    .andExpect(jsonPath("$[0].professorNome").value(response.getProfessorNome()));

            verify(avaliacaoService).listarPorProfessor(professorId);
        }

        @Test
        @DisplayName("Deve retornar 404 Not Found quando o professor não for encontrado")
        void deveRetornar404QuandoProfessorNaoEncontrado() throws Exception {
            UUID professorId = UUID.randomUUID();
            when(avaliacaoService.listarPorProfessor(professorId))
                    .thenThrow(new RecursoNaoEncontradoException("Professor não encontrado"));

            mockMvc.perform(get(BASE_URL + "/professores/{professorId}", professorId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Professor não encontrado"));

            verify(avaliacaoService).listarPorProfessor(professorId);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o professorId não for um UUID válido")
        void deveRetornar400QuandoProfessorIdInvalido() throws Exception {
            mockMvc.perform(get(BASE_URL + "/professores/{professorId}", "professor-invalido"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(avaliacaoService);
        }
    }

    @Nested
    @DisplayName("PUT /api/avaliacoes/{id}")
    class Atualizar {

        @Test
        @DisplayName("Deve retornar 200 OK com a avaliação atualizada quando os dados forem válidos")
        void deveRetornar200QuandoAtualizacaoValida() throws Exception {
            UUID id = UUID.randomUUID();
            AvaliacaoRequestDTO request = requestValido();
            AvaliacaoResponseDTO response = responseValido(id, request.getAlunoId(), request.getProfessorId());

            when(avaliacaoService.atualizar(eq(id), any(AvaliacaoRequestDTO.class))).thenReturn(response);

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.descricao").value(response.getDescricao()))
                    .andExpect(jsonPath("$.alunoId").value(request.getAlunoId().toString()))
                    .andExpect(jsonPath("$.professorId").value(request.getProfessorId().toString()));

            ArgumentCaptor<AvaliacaoRequestDTO> captor = ArgumentCaptor.forClass(AvaliacaoRequestDTO.class);
            verify(avaliacaoService).atualizar(eq(id), captor.capture());
            assertThat(captor.getValue().getDescricao()).isEqualTo(request.getDescricao());
            assertThat(captor.getValue().getAlunoId()).isEqualTo(request.getAlunoId());
            assertThat(captor.getValue().getProfessorId()).isEqualTo(request.getProfessorId());
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o payload de atualização for inválido")
        void deveRetornar400QuandoPayloadInvalido() throws Exception {
            UUID id = UUID.randomUUID();
            AvaliacaoRequestDTO request = new AvaliacaoRequestDTO();

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.descricao").exists())
                    .andExpect(jsonPath("$.errors.alunoId").exists())
                    .andExpect(jsonPath("$.errors.professorId").exists());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o ID no caminho da atualização não for um UUID válido")
        void deveRetornar400QuandoIdInvalido() throws Exception {
            mockMvc.perform(put(BASE_URL + "/{id}", "id-invalido")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(requestValido())))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(avaliacaoService);
        }

        @Test
        @DisplayName("Deve retornar 404 Not Found quando a avaliação não existir na atualização")
        void deveRetornar404QuandoNaoEncontrada() throws Exception {
            UUID id = UUID.randomUUID();
            AvaliacaoRequestDTO request = requestValido();

            when(avaliacaoService.atualizar(eq(id), any(AvaliacaoRequestDTO.class)))
                    .thenThrow(new RecursoNaoEncontradoException("Avaliação não encontrada"));

            mockMvc.perform(put(BASE_URL + "/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Avaliação não encontrada"));

            verify(avaliacaoService).atualizar(eq(id), any(AvaliacaoRequestDTO.class));
        }
    }

    @Nested
    @DisplayName("DELETE /api/avaliacoes/{id}")
    class Deletar {

        @Test
        @DisplayName("Deve retornar 204 No Content sem corpo quando a exclusão for bem-sucedida")
        void deveRetornar204QuandoExclusaoBemSucedida() throws Exception {
            UUID id = UUID.randomUUID();
            doNothing().when(avaliacaoService).deletar(id);

            mockMvc.perform(delete(BASE_URL + "/{id}", id))
                    .andExpect(status().isNoContent())
                    .andExpect(content().string(""));

            verify(avaliacaoService).deletar(id);
        }

        @Test
        @DisplayName("Deve retornar 404 Not Found quando a avaliação não existir na exclusão")
        void deveRetornar404QuandoNaoEncontrada() throws Exception {
            UUID id = UUID.randomUUID();
            doThrow(new RecursoNaoEncontradoException("Avaliação não encontrada"))
                    .when(avaliacaoService).deletar(id);

            mockMvc.perform(delete(BASE_URL + "/{id}", id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message").value("Avaliação não encontrada"));

            verify(avaliacaoService).deletar(id);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o ID no caminho da exclusão não for um UUID válido")
        void deveRetornar400QuandoIdInvalido() throws Exception {
            mockMvc.perform(delete(BASE_URL + "/{id}", "id-invalido"))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(avaliacaoService);
        }
    }
}
