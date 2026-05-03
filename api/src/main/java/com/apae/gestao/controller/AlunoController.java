package com.apae.gestao.controller;

import com.apae.gestao.dto.AlunoTurmaRequestDTO;
import com.apae.gestao.dto.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoDetalhesDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoItemDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoResponseDTO;
import com.apae.gestao.service.AlunoService;
import com.apae.gestao.openapi.Doc400ValidationError;
import com.apae.gestao.openapi.Doc404NotFound;
import com.apae.gestao.openapi.DocStandardErrors;

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
            @RequestParam(defaultValue = "false", required = false) Boolean apenasAtivos,
            @PageableDefault(size = 30, sort = "nome")
            Pageable pageable
    ) {
        Page<AlunoResumoDTO> alunos =
                alunoService.listarAlunosPorNome(nome,apenasAtivos, pageable);

        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar aluno por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aluno encontrado")
    })
    @Doc404NotFound
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
        @ApiResponse(responseCode = "422", description = "Regra de negócio violada (Turma Inativa)")
    })
    @DocStandardErrors
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
    @Doc404NotFound
    public ResponseEntity<List<AvaliacaoHistoricoResponseDTO>> buscarAvaliacoesPorAlunoId(
            @PathVariable Long id
    ) {
        List<AvaliacaoHistoricoResponseDTO> avaliacoes =
                alunoService.buscarAvaliacoesPorAlunoId(id);

        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/{id}/turmas")
    @Operation(
        summary = "Listar histórico de turmas do aluno",
        description = "Retorna todas as turmas em que o aluno possui ou possuiu vínculo (ativas ou inativas, vínculo atual ou antigo)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    })
    @Doc404NotFound
    public ResponseEntity<List<AlunoTurmaHistoricoItemDTO>> listarHistoricoTurmasPorAlunoId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(alunoService.listarHistoricoTurmasPorAlunoId(id));
    }

    @GetMapping("/{id}/turmas/historico")
    @Operation(summary = "Buscar histórico de turmas do aluno (vínculos ativos e anteriores)")
    public ResponseEntity<List<AlunoTurmaHistoricoResponseDTO>> buscarHistoricoTurmasPorAlunoId(
            @PathVariable Long id
    ) {
        List<AlunoTurmaHistoricoResponseDTO> historico =
                alunoService.buscarHistoricoTurmasPorAlunoId(id);

        return ResponseEntity.ok(historico);
    }
}