package com.apae.gestao.controller;

import java.util.List;

import com.apae.gestao.dto.AlunoResponseDTO;
import com.apae.gestao.dto.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.dto.ApiErrorResponse;
import com.apae.gestao.service.AlunoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alunos")
@Tag(name = "Alunos", description = "Consultas públicas aos alunos cadastrados.")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    @Operation(
        summary = "Listar alunos", 
        description = "Retorna todos os alunos que têm essa String no nome, desconsiderando letra maiúscula."
    )
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunosPorNome(
            @Parameter(example = "João", in = ParameterIn.QUERY)
            @RequestParam(value = "nome", required = false) String nome) {
        
        List<AlunoResponseDTO> alunos = alunoService.listarAlunosPorNome(nome);
        
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar aluno por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aluno encontrado", content = @Content(schema = @Schema(implementation = AlunoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<AlunoResponseDTO> buscarPorId(
            @Parameter(description = "Identificador do aluno", example = "4", in = ParameterIn.PATH) @PathVariable Long id) {
        AlunoResponseDTO aluno = alunoService.buscarPorId(id);
        return ResponseEntity.ok(aluno);
    }

    @GetMapping("/{id}/avaliacoes")
    @Operation(summary = "Buscar histórico de avaliações do aluno")
    public ResponseEntity<List<AvaliacaoHistoricoResponseDTO>> buscarAvaliacoesPorAlunoId(
            @Parameter(description = "Identificador do aluno") @PathVariable Long id) {
        List<AvaliacaoHistoricoResponseDTO> avaliacoes = alunoService.buscarAvaliacoesPorAlunoId(id);
        return ResponseEntity.ok(avaliacoes);
    }
}
