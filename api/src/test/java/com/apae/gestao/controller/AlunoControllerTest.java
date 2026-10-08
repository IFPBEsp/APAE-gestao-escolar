package com.apae.gestao.controller;

import com.apae.gestao.dto.aluno.AlunoDetalhesDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoItemDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaRequestDTO;
import com.apae.gestao.dto.avaliacao.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.service.AlunoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = AlunoController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
        },
        excludeFilters = {
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.apae.gestao.security..*")
        }
)
@AutoConfigureMockMvc(addFilters = false)
class AlunoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AlunoService alunoService;

    @Test
    @DisplayName("Deve listar alunos com filtros de nome, apenasAtivos e paginação retornando 200 OK")
    void deveListarAlunosPorNome() throws Exception {
        Page<AlunoResumoDTO> paginaMock = new PageImpl<>(Collections.emptyList());
        Mockito.when(alunoService.listarAlunosPorNome(any(), any(), any(Pageable.class)))
               .thenReturn(paginaMock);

        mockMvc.perform(get("/api/alunos")
                        .param("nome", "João")
                        .param("apenasAtivos", "true")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").exists());
    }

    @Test
    @DisplayName("Deve buscar aluno por ID e retornar status 200 OK")
    void deveBuscarPorId() throws Exception {
        UUID alunoId = UUID.randomUUID();
        AlunoDetalhesDTO mockDetalhes = Mockito.mock(AlunoDetalhesDTO.class);
        
        Mockito.when(alunoService.buscarPorId(alunoId)).thenReturn(mockDetalhes);

        mockMvc.perform(get("/api/alunos/{id}", alunoId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve retornar status 404 Not Found quando o aluno não for encontrado por ID")
    void deveRetornar404QuandoAlunoNaoEncontradoPorId() throws Exception {
        
        UUID alunoId = UUID.randomUUID();
        Mockito.when(alunoService.buscarPorId(alunoId))
               .thenThrow(new RecursoNaoEncontradoException("Aluno não encontrado"));

        mockMvc.perform(get("/api/alunos/{id}", alunoId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve atualizar turma do aluno e retornar status 200 OK")
    void deveAtualizarTurma() throws Exception {
        UUID alunoId = UUID.randomUUID();
        UUID novaTurmaId = UUID.randomUUID();
        
        Map<String, String> requestBody = Map.of("novaTurmaId", novaTurmaId.toString());
        
        AlunoDetalhesDTO mockDetalhes = Mockito.mock(AlunoDetalhesDTO.class);
        Mockito.when(alunoService.atualizarTurma(eq(alunoId), any(AlunoTurmaRequestDTO.class)))
               .thenReturn(mockDetalhes);

        mockMvc.perform(patch("/api/alunos/{alunoId}/turma", alunoId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve retornar status 400 Bad Request ao tentar atualizar turma com payload inválido (@Valid)")
    void deveRetornar400AoAtualizarTurmaComPayloadInvalido() throws Exception {
        UUID alunoId = UUID.randomUUID();
        String payloadInvalido = "{}"; 

        mockMvc.perform(patch("/api/alunos/{alunoId}/turma", alunoId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadInvalido))
                .andExpect(status().isBadRequest());

        verify(alunoService, never()).atualizarTurma(any(), any());
    }

    @Test
    @DisplayName("Deve buscar histórico de avaliações do aluno e retornar status 200 OK")
    void deveBuscarAvaliacoesPorAlunoId() throws Exception {
        UUID alunoId = UUID.randomUUID();
        List<AvaliacaoHistoricoResponseDTO> mockList = Collections.emptyList();
        
        Mockito.when(alunoService.buscarAvaliacoesPorAlunoId(alunoId)).thenReturn(mockList);

        mockMvc.perform(get("/api/alunos/{id}/avaliacoes", alunoId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve listar histórico de turmas (ItemDTO) do aluno e retornar status 200 OK")
    void deveListarHistoricoTurmasPorAlunoId() throws Exception {
        UUID alunoId = UUID.randomUUID();
        List<AlunoTurmaHistoricoItemDTO> mockList = Collections.emptyList();
        
        Mockito.when(alunoService.listarHistoricoTurmasPorAlunoId(alunoId)).thenReturn(mockList);

        mockMvc.perform(get("/api/alunos/{id}/turmas", alunoId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve buscar histórico de turmas (ResponseDTO) do aluno e retornar status 200 OK")
    void deveBuscarHistoricoTurmasPorAlunoId() throws Exception {
        UUID alunoId = UUID.randomUUID();
        List<AlunoTurmaHistoricoResponseDTO> mockList = Collections.emptyList();
        
        Mockito.when(alunoService.buscarHistoricoTurmasPorAlunoId(alunoId)).thenReturn(mockList);

        mockMvc.perform(get("/api/alunos/{id}/turmas/historico", alunoId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}