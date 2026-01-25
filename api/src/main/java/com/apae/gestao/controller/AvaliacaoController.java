package com.apae.gestao.controller;

import com.apae.gestao.dto.AvaliacaoRequestDTO;
import com.apae.gestao.dto.AvaliacaoResponseDTO;
import com.apae.gestao.dto.ApiErrorResponse;
import com.apae.gestao.service.AvaliacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@Tag(name = "Avaliações", description = "Criação e gerenciamento de avaliações dos alunos.")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    @Operation(summary = "Criar uma nova avaliação")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Avaliação criada com sucesso", content = @Content(schema = @Schema(implementation = AvaliacaoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<AvaliacaoResponseDTO> criar(@Valid @RequestBody AvaliacaoRequestDTO dto) {
        AvaliacaoResponseDTO response = avaliacaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar todas as avaliações")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarTodas() {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarTodas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar avaliação por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Avaliação encontrada", content = @Content(schema = @Schema(implementation = AvaliacaoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Avaliação não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<AvaliacaoResponseDTO> buscarPorId(
            @Parameter(description = "Identificador da avaliação", example = "1", in = ParameterIn.PATH) @PathVariable Long id) {
        AvaliacaoResponseDTO response = avaliacaoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/alunos/{alunoId}")
    @Operation(summary = "Listar avaliações por aluno")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorAluno(
            @Parameter(description = "ID do aluno", example = "5", in = ParameterIn.PATH) @PathVariable Long alunoId) {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarPorAluno(alunoId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/professores/{professorId}")
    @Operation(summary = "Listar avaliações por professor")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorProfessor(
            @Parameter(description = "ID do professor", example = "2", in = ParameterIn.PATH) @PathVariable Long professorId) {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarPorProfessor(professorId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar uma avaliação")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Avaliação atualizada", content = @Content(schema = @Schema(implementation = AvaliacaoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Avaliação não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<AvaliacaoResponseDTO> atualizar(
            @Parameter(description = "Identificador da avaliação", example = "1", in = ParameterIn.PATH) @PathVariable Long id,
            @Valid @RequestBody AvaliacaoRequestDTO dto) {
        AvaliacaoResponseDTO response = avaliacaoService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma avaliação")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Avaliação deletada"),
            @ApiResponse(responseCode = "404", description = "Avaliação não encontrada", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> deletar(
            @Parameter(description = "Identificador da avaliação", example = "1", in = ParameterIn.PATH) @PathVariable Long id) {
        avaliacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}