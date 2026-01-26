package com.apae.gestao.controller;

import com.apae.gestao.dto.ChamadaResponseDTO;
import com.apae.gestao.dto.RegistrarChamadaRequestDTO;
import com.apae.gestao.service.PresencaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/presencas")
@RequiredArgsConstructor
public class PresencaController {

    private final PresencaService presencaService;

    @GetMapping("/chamadas/turmas/{turmaId}")
    public ResponseEntity<ChamadaResponseDTO> getChamadaPorTurmaEData(
            @PathVariable Long turmaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        ChamadaResponseDTO response = presencaService.getChamadaPorTurmaEData(turmaId, data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chamadas/turmas/{turmaId}")
    public ResponseEntity<ChamadaResponseDTO> registrarChamada(
            @PathVariable Long turmaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @Valid @RequestBody RegistrarChamadaRequestDTO request) {

        ChamadaResponseDTO response = presencaService.registrarChamada(turmaId, data, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        presencaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}