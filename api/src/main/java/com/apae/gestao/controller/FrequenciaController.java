package com.apae.gestao.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.service.FrequenciaService;
import com.apae.gestao.openapi.Doc404NotFound;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/frequencia")
@Tag(name = "Frequências", description = "Consulta de frequência e histórico de presença.")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FrequenciaController {

    private final FrequenciaService frequenciaService;

    @GetMapping("/turma/{id}/resumo")
    @Operation(summary = "Resumo de frequência da turma", description = "Retorna o resumo de frequência de uma turma específica.")
    @Doc404NotFound
    public TurmaResumoFrequenciaDTO getResumoTurma(@PathVariable Long id) {
        return frequenciaService.getResumoTurma(id);
    }

    @GetMapping("/turma/{id}/alunos")
    @Operation(summary = "Listar alunos com frequência da turma", description = "Lista os alunos de uma turma com seus dados de frequência.")
    @Doc404NotFound
    public Page<AlunoFrequenciaResumoDTO> listarAlunos(
        @PathVariable Long id,
        Pageable pageable
    ) {
        return frequenciaService.listarAlunos(id, pageable);
    }

    @GetMapping("/aluno/{id}/historico")
    @Operation(summary = "Histórico individual de presença do aluno", description = "Retorna o histórico detalhado de presença de um aluno específico.")
    @Doc404NotFound
    public Page<AulaPresencaAlunoResponseDTO> getHistoricoIndividualAluno(
        @PathVariable Long id,
        Pageable pageable
    ) {
        return frequenciaService.getHistoricoIndividualAluno(id, pageable);
    }
}