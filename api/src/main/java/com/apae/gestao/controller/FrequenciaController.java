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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/frequencia")
@Tag(name = "Frequências")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FrequenciaController {

    
    private final FrequenciaService frequenciaService;

    @GetMapping("/turma/{id}/resumo")
    public TurmaResumoFrequenciaDTO getResumoTurma(@PathVariable Long id) {
        return frequenciaService.getResumoTurma(id);
    }

    @GetMapping("/turma/{id}/alunos")
    public Page<AlunoFrequenciaResumoDTO> listarAlunos(
        @PathVariable Long id,
        Pageable pageable
    ) {
        return frequenciaService.listarAlunos(id, pageable);
    }

    @GetMapping("/aluno/{id}/historico")
    public Page<AulaPresencaAlunoResponseDTO> getHistoricoIndividualAluno(
        @PathVariable Long id,
        Pageable pageable
    ) {
        return frequenciaService.getHistoricoIndividualAluno(id, pageable);
    }
}