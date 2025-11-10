package com.apae.gestao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.dto.TurmaRequestDTO;
import com.apae.gestao.dto.TurmaResponseDTO;
import com.apae.gestao.service.TurmaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {
    @Autowired
    private TurmaService service;

    @PostMapping
    public ResponseEntity<TurmaResponseDTO> criar(@Valid @RequestBody TurmaRequestDTO dto){
        TurmaResponseDTO response = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{turmaId}")
    public ResponseEntity<TurmaResponseDTO> listarPorId(@PathVariable long turmaId){
        TurmaResponseDTO response = service.buscarPorId(turmaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listarTodas(){
        List<TurmaResponseDTO> response = service.listarTodas();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{turmaId}")
    public ResponseEntity<TurmaResponseDTO> atualizar(@PathVariable Long turmaId, @Valid @RequestBody TurmaRequestDTO dto){
        TurmaResponseDTO response = service.atualizar(turmaId, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> deletar(@PathVariable Long id){
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{turmaId}/professores")
    public ResponseEntity<TurmaResponseDTO> vincularProfessoresATurma(
        @PathVariable Long turmaId,
        @RequestBody List<Long> idProfessores
    ){
        TurmaResponseDTO atualizado = service.vincularProfessoresATurma(turmaId, idProfessores);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping("/{turmaId}/professores")
    public ResponseEntity<List<ProfessorResponseDTO>> listarProfessoresNaTurma(@PathVariable Long turmaId){
        List<ProfessorResponseDTO> response = service.listarProfessoresNaTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{turmaId}/professores/{professorId}")
    public ResponseEntity<TurmaResponseDTO> desvincularProfessor(
        @PathVariable Long turmaId,
        @PathVariable Long professorId
    ){
        TurmaResponseDTO atualizado = service.desvincularProfessor(turmaId, professorId);
        return ResponseEntity.ok(atualizado);
    }

    @PatchMapping("/{turmaId}/ativar")
    public ResponseEntity<TurmaResponseDTO> ativarTurma(@PathVariable Long turmaId) {
        try {
            TurmaResponseDTO response = service.ativarTurma(turmaId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{turmaId}/desativar")
    public ResponseEntity<TurmaResponseDTO> desativarTurma(@PathVariable Long turmaId) {
        try {
            TurmaResponseDTO response = service.desativarTurma(turmaId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
