package com.apae.gestao.controller;

import com.apae.gestao.dto.AlunoResponseDTO;
import com.apae.gestao.service.AlunoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    public List<AlunoResponseDTO> listarTodos() {
        return alunoService.listarTodos();
    }
}
