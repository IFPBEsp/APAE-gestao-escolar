package com.apae.gestao.controller;

import com.apae.gestao.dto.AlunoTurmaRequestDTO;
import com.apae.gestao.dto.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoDetalhesDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.service.AlunoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@Tag(name = "Alunos", description = "Consultas e manipulação de alunos cadastrados.")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    @Operation(
        summary = "Listar alunos",
        description = "Retorna alunos paginados. Pode filtrar por nome."
    )
    public ResponseEntity<Page<AlunoResumoDTO>> listarAlunosPorNome(
            @Parameter(example = "João", in = ParameterIn.QUERY)
            @RequestParam(value = "nome", required = false) String nome,

            @PageableDefault(size = 12, sort = "nome")
            Pageable pageable
    ) {
        Page<AlunoResumoDTO> alunos =
                alunoService.listarAlunosPorNome(nome, pageable);

        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar aluno por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<AlunoDetalhesDTO> buscarPorId(@PathVariable Long id) {
        AlunoDetalhesDTO aluno = alunoService.buscarPorId(id);
        return ResponseEntity.ok(aluno);
    }

    @PatchMapping("/{alunoId}/turma")
    @Operation(
        summary = "Atualizar a turma atual do aluno",
        description = "Desativa a turma anterior e ativa a nova turma."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Turma atualizada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Aluno ou Turma não encontrados"),
        @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    public ResponseEntity<AlunoDetalhesDTO> atualizarTurma(
        @PathVariable Long alunoId,
        @Valid @RequestBody AlunoTurmaRequestDTO dto
    ) {
        AlunoDetalhesDTO alunoAtualizado =
                alunoService.atualizarTurma(alunoId, dto);

        return ResponseEntity.ok(alunoAtualizado);
    }

    @GetMapping("/{id}/avaliacoes")
    @Operation(summary = "Buscar histórico de avaliações do aluno")
    public ResponseEntity<List<AvaliacaoHistoricoResponseDTO>> buscarAvaliacoesPorAlunoId(
            @PathVariable Long id
    ) {
        List<AvaliacaoHistoricoResponseDTO> avaliacoes =
                alunoService.buscarAvaliacoesPorAlunoId(id);

        return ResponseEntity.ok(avaliacoes);
    }
}