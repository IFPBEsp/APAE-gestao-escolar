package com.apae.gestao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apae.gestao.dto.TurmaAlunoResponseDTO;
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

    @PutMapping("/{turmaId}/professor/{professorId}")
    public ResponseEntity<TurmaResponseDTO> atribuirProfessor(
            @PathVariable Long turmaId,
            @PathVariable Long professorId
    ){
        TurmaResponseDTO atualizado = service.vincularProfessoresATurma(turmaId, professorId);
        return ResponseEntity.ok(atualizado);
    } @PatchMapping("/{turmaId}/ativar")
    public ResponseEntity<TurmaResponseDTO> ativarTurma(@PathVariable Long turmaId) {
        TurmaResponseDTO response = service.ativarTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{turmaId}/inativar")
    public ResponseEntity<TurmaResponseDTO> desativarTurma(@PathVariable Long turmaId) {
        TurmaResponseDTO response = service.desativarTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{turmaId}/alunos")
    public ResponseEntity<TurmaResponseDTO> adicionarAlunos(@RequestBody List<Long> alunosId, @PathVariable Long turmaId){
        TurmaResponseDTO response = service.adicionarAlunos(turmaId, alunosId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{turmaId}/alunos")
    public ResponseEntity<List<TurmaAlunoResponseDTO>> listarAlunosNaTurma(@PathVariable Long turmaId){
        List<TurmaAlunoResponseDTO> response = service.listarAlunos(turmaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{turmaId}/alunos/ativos")
    public ResponseEntity<List<TurmaAlunoResponseDTO>> listarAlunosAtivosNaTurma(@PathVariable Long turmaId){
        List<TurmaAlunoResponseDTO> response = service.listarAlunosAtivos(turmaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{turmaId}/alunos/inativos")
    public ResponseEntity<List<TurmaAlunoResponseDTO>> listarAlunosInativosNaTurma(@PathVariable Long turmaId){
        List<TurmaAlunoResponseDTO> response = service.listarAlunosInativos(turmaId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{turmaId}/alunos/{alunoId}/ativar")
    public ResponseEntity<TurmaAlunoResponseDTO> ativarAlunoNaTurma(@PathVariable Long turmaId, @PathVariable Long alunoId){
        service.ativarAluno(alunoId, turmaId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{turmaId}/alunos/{alunoId}/inativar")
    public ResponseEntity<TurmaAlunoResponseDTO> desativarAlunoNaTurma(@PathVariable Long turmaId, @PathVariable Long alunoId){
        service.desativarAluno(alunoId, turmaId);
        return ResponseEntity.ok().build();
    }
}
