package com.apae.gestao.controller;

import com.apae.gestao.dto.AvaliacaoRequestDTO;
import com.apae.gestao.dto.AvaliacaoResponseDTO;
import com.apae.gestao.service.AvaliacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoResponseDTO> criar(@Valid @RequestBody AvaliacaoRequestDTO dto) {
        AvaliacaoResponseDTO response = avaliacaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarTodas() {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarTodas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        AvaliacaoResponseDTO response = avaliacaoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/alunos/{alunoId}")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarPorAluno(alunoId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/professores/{professorId}")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorProfessor(@PathVariable Long professorId) {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarPorProfessor(professorId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avaliacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}