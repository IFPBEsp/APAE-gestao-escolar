package com.apae.gestao.controller;

import com.apae.gestao.dto.aula.chamada.ChamadaResponseDTO;
import com.apae.gestao.dto.aula.chamada.RegistrarChamadaRequestDTO;
import com.apae.gestao.service.PresencaService;
import com.apae.gestao.openapi.Doc404NotFound;
import com.apae.gestao.openapi.DocStandardErrors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/presencas")
@Tag(name = "Presenças", description = "Gerenciamento de chamadas e presenças dos alunos.")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class PresencaController {

    private final PresencaService presencaService;

    @GetMapping("/chamadas/turmas/{turmaId}")
    @Operation(summary = "Buscar chamada por turma e data", description = "Retorna a chamada de uma turma em uma data específica.")
    @Doc404NotFound
    public ResponseEntity<ChamadaResponseDTO> getChamadaPorTurmaEData(
            @PathVariable Long turmaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        ChamadaResponseDTO response = presencaService.getChamadaPorTurmaEData(turmaId, data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chamadas/turmas/{turmaId}")
    @Operation(summary = "Registrar chamada", description = "Registra a chamada de presença para uma turma em uma data específica.")
    @DocStandardErrors
    public ResponseEntity<ChamadaResponseDTO> registrarChamada(
            @PathVariable Long turmaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @Valid @RequestBody RegistrarChamadaRequestDTO request) {

        ChamadaResponseDTO response = presencaService.registrarChamada(turmaId, data, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar presença", description = "Remove um registro de presença pelo ID.")
    @Doc404NotFound
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        presencaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}