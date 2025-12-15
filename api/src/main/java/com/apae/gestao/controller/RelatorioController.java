package com.apae.gestao.controller;

import java.util.List;

import com.apae.gestao.dto.ApiErrorResponse;
import com.apae.gestao.dto.RelatorioRequestDTO;
import com.apae.gestao.dto.RelatorioResponseDTO;
import com.apae.gestao.service.RelatorioService;

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

    @GetMapping
    @Operation(summary = "Listar todos os relatórios")
    public ResponseEntity<List<RelatorioResponseDTO>> listarTodos() {
        List<RelatorioResponseDTO> relatorios = relatorioService.listarTodos();
        return ResponseEntity.ok(relatorios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar relatório por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Relatório encontrado", content = @Content(schema = @Schema(implementation = RelatorioResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Relatório não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<RelatorioResponseDTO> buscarPorId(
            @Parameter(description = "Identificador do relatório", example = "1", in = ParameterIn.PATH) @PathVariable Long id) {
        RelatorioResponseDTO relatorio = relatorioService.buscarPorId(id);
        return ResponseEntity.ok(relatorio);
    }

    
    @PostMapping
    @Operation(summary = "Criar um novo relatório")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Relatório criado", content = @Content(schema = @Schema(implementation = RelatorioResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<RelatorioResponseDTO> criar(@RequestBody RelatorioRequestDTO request) {
        RelatorioResponseDTO relatorio = relatorioService.criar(request);
        return ResponseEntity.ok(relatorio);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um relatório")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Relatório atualizado", content = @Content(schema = @Schema(implementation = RelatorioResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Relatório não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<RelatorioResponseDTO> atualizar(
            @Parameter(description = "Identificador do relatório", example = "1", in = ParameterIn.PATH) @PathVariable Long id,
            @RequestBody RelatorioRequestDTO request) {
        RelatorioResponseDTO relatorio = relatorioService.atualizar(id, request);
        return ResponseEntity.ok(relatorio);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar um relatório")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Relatório deletado"),
            @ApiResponse(responseCode = "404", description = "Relatório não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> deletar(
            @Parameter(description = "Identificador do relatório", example = "1", in = ParameterIn.PATH) @PathVariable Long id) {
        relatorioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}