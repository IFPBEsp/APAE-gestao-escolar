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
        try {
            TurmaResponseDTO response = service.criar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{turmaId}")
    public ResponseEntity<TurmaResponseDTO> listarPorId(@PathVariable long turmaId){
        try {
            TurmaResponseDTO response = service.buscarPorId(turmaId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listarTodas(){
        List<TurmaResponseDTO> response = service.listarTodas();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{turmaId}")
    public ResponseEntity<TurmaResponseDTO> atualizar(@PathVariable Long turmaId, @Valid @RequestBody TurmaRequestDTO dto){
        try {
            TurmaResponseDTO response = service.atualizar(turmaId, dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> deletar(@PathVariable Long id){
        try {
            service.buscarPorId(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{turmaId}/professores")
    public ResponseEntity<TurmaResponseDTO> vincularProfessoresATurma(
        @PathVariable Long turmaId,
        @RequestBody List<Long> idProfessores
    ){
        try {
            TurmaResponseDTO atualizado = service.vincularProfessoresATurma(turmaId, idProfessores);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{turmaId}/professores")
    public ResponseEntity<List<ProfessorResponseDTO>> listarProfessoresNaTurma(@PathVariable Long turmaId){
        try {
            List<ProfessorResponseDTO> response = service.listarProfessoresNaTurma(turmaId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{turmaId}/professores/{professorId}")
    public ResponseEntity<TurmaResponseDTO> desvincularProfessor(
        @PathVariable Long turmaId,
        @PathVariable Long professorId
    ){
        try {
            TurmaResponseDTO atualizado = service.desvincularProfessor(turmaId, professorId);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
