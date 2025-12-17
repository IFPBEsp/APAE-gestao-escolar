package com.apae.gestao.controller;

import java.util.List;

import com.apae.gestao.dto.ApiErrorResponse;
import com.apae.gestao.dto.ProfessorRequestDTO;
import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.dto.TurmaResponseDTO;
import com.apae.gestao.service.ProfessorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/professores")
@Tag(name = "Professores", description = "Operações de cadastro e manutenção de professores.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @PostMapping
    @Operation(
        summary = "Cadastrar professor",
        description = "Registra um novo professor com todas as informações obrigatórias e opcionais."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Professor criado com sucesso",
            content = @Content(schema = @Schema(implementation = ProfessorResponseDTO.class),
                examples = @ExampleObject(name = "ProfessorCriado", value = """
                        {
                          "id": 42,
                          "nome": "Maria da Silva",
                          "cpf": "12345678901",
                          "email": "maria.silva@apae.org.br",
                          "telefone": "(11) 98888-0000",
                          "dataNascimento": "1990-05-12",
                          "especialidade": "Educação Especial",
                          "dataContratacao": "2024-02-01",
                          "endereco": "Av. Brasil, 1000 - Centro, Recife/PE",
                          "ativo": true
                        }
                        """))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(name = "ErroValidacao", value = """
                        {
                          "timestamp": "2024-11-20T12:20:00",
                          "status": 400,
                          "error": "Erro de validação",
                          "message": "Revise os campos enviados antes de reenviar a requisição.",
                          "path": "/api/professores",
                          "errors": {
                            "cpf": "CPF já cadastrado"
                          }
                        }
                        """)))
    })
    public ResponseEntity<ProfessorResponseDTO> criar(@Valid @RequestBody ProfessorRequestDTO dto) {
        ProfessorResponseDTO response = professorService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
        summary = "Listar todos os professores",
        description = "Retorna TODOS os professores cadastrados (ativos e inativos)."
    )
    public ResponseEntity<List<ProfessorResponseDTO>> listarTodos() {
        List<ProfessorResponseDTO> professores = professorService.listarTodos();
        return ResponseEntity.ok(professores);
    }

    @GetMapping("/buscar")
    @Operation(
        summary = "Buscar professores com filtros",
        description = "Busca professores por nome e/ou status ativo."
    )
    public ResponseEntity<List<ProfessorResponseDTO>> listarPorNomeEStatus(
            @Parameter(example = "Maria", in = ParameterIn.QUERY)
            @RequestParam(value = "nome", required = false) String nome,
            @Parameter(example = "true", in = ParameterIn.QUERY)
            @RequestParam(value = "ativo", required = false) Boolean ativo) {
        
        List<ProfessorResponseDTO> professores = professorService.listarPorNomeEStatus(nome, ativo);
        return ResponseEntity.ok(professores);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar professor por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Professor encontrado", content = @Content(schema = @Schema(implementation = ProfessorResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "Professor não encontrado", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ProfessorResponseDTO> buscarPorId(
            @Parameter(description = "Identificador do professor", example = "10", in = ParameterIn.PATH)
            @PathVariable Long id) {
        ProfessorResponseDTO response = professorService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar professor existente")
    public ResponseEntity<ProfessorResponseDTO> atualizar(
            @Parameter(description = "Identificador do professor", example = "10", in = ParameterIn.PATH)
            @PathVariable Long id,
            @Valid @RequestBody ProfessorRequestDTO dto) {
        ProfessorResponseDTO response = professorService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/inativar")
    @Operation(summary = "Inativar professor")
    public ResponseEntity<ProfessorResponseDTO> inativar(
            @Parameter(description = "Identificador do professor", example = "10", in = ParameterIn.PATH)
            @PathVariable Long id) {
        ProfessorResponseDTO response = professorService.inativar(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Reativar professor")
    public ResponseEntity<ProfessorResponseDTO> reativar(
            @Parameter(description = "Identificador do professor", example = "10", in = ParameterIn.PATH)
            @PathVariable Long id) {
        ProfessorResponseDTO response = professorService.reativarProfessor(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/turmas")
    public ResponseEntity<List<TurmaResponseDTO>> getTurmasDeProfessor(@PathVariable Long id){
        List<TurmaResponseDTO> response = professorService.getTurmasDeProfessor(id);
        return ResponseEntity.ok(response);
    }
}

