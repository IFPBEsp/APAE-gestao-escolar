package com.apae.gestao.controller;

import java.util.List;
import java.util.UUID;

import com.apae.gestao.dto.relatorio.RelatorioRequestDTO;
import com.apae.gestao.dto.relatorio.RelatorioResponseDTO;
import com.apae.gestao.service.RelatorioService;
import com.apae.gestao.openapi.Doc400ValidationError;
import com.apae.gestao.openapi.Doc404NotFound;
import com.apae.gestao.openapi.DocStandardErrors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
@Tag(name = "Relatórios", description = "Gerenciamento de relatórios individuais dos alunos.")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }
    
    @PostMapping
    @Operation(summary = "Criar um novo relatório")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Relatório criado", content = @Content(schema = @Schema(implementation = RelatorioResponseDTO.class)))
    })
    @Doc400ValidationError
    public ResponseEntity<RelatorioResponseDTO> criar(@RequestBody RelatorioRequestDTO request) {
        RelatorioResponseDTO relatorio = relatorioService.criar(request);
        return ResponseEntity.ok(relatorio);
    }

    @GetMapping
    @Operation(summary = "Listar todos os relatórios")
    public ResponseEntity<List<RelatorioResponseDTO>> listarTodos() {
        List<RelatorioResponseDTO> relatorios = relatorioService.listarTodos();
        return ResponseEntity.ok(relatorios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar relatório por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Relatório encontrado", content = @Content(schema = @Schema(implementation = RelatorioResponseDTO.class)))
    })
    @Doc404NotFound
    public ResponseEntity<RelatorioResponseDTO> buscarPorId(
            @Parameter(description = "Identificador do relatório", in = ParameterIn.PATH) @PathVariable UUID id) {
        RelatorioResponseDTO relatorio = relatorioService.buscarPorId(id);
        return ResponseEntity.ok(relatorio);
    }

    @GetMapping("/alunos/{alunoId}")
    @Operation(summary = "Listar relatórios de um aluno específico")
    @Doc404NotFound
    public ResponseEntity<List<RelatorioResponseDTO>> listarPorAluno(@PathVariable UUID alunoId) {
        List<RelatorioResponseDTO> relatorios = relatorioService.buscarPorAluno(alunoId);
        return ResponseEntity.ok(relatorios);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um relatório")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Relatório atualizado", content = @Content(schema = @Schema(implementation = RelatorioResponseDTO.class)))
    })
    @DocStandardErrors
    public ResponseEntity<RelatorioResponseDTO> atualizar(
            @Parameter(description = "Identificador do relatório", in = ParameterIn.PATH) @PathVariable UUID id,
            @RequestBody RelatorioRequestDTO request) {
        RelatorioResponseDTO relatorio = relatorioService.atualizar(id, request);
        return ResponseEntity.ok(relatorio);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar um relatório")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Relatório deletado")
    })
    @Doc404NotFound
    public ResponseEntity<Void> deletar(
            @Parameter(description = "Identificador do relatório", in = ParameterIn.PATH) @PathVariable UUID id) {
        relatorioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
