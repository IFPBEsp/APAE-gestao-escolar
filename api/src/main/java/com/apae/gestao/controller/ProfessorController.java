package com.apae.gestao.controller;

import java.util.List;
import java.util.UUID;

import com.apae.gestao.dto.professor.ProfessorRequestDTO;
import com.apae.gestao.dto.professor.ProfessorResponseDTO;
import com.apae.gestao.dto.professor.ProfessorResumoDTO;
import com.apae.gestao.service.ProfessorService;
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
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/professores")
@Tag(name = "Professores", description = "Operações de cadastro e manutenção de professores")
@SecurityRequirement(name = "bearerAuth")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    @Operation(summary = "Listar professores")
    @ApiResponse(responseCode = "200", description = "Lista de professores retornada com sucesso")
    public ResponseEntity<List<ProfessorResumoDTO>> listarTodos(
            @Parameter(description = "ID do professor", in = ParameterIn.QUERY)
            @RequestParam(value = "id", required = false) UUID id,

            @Parameter(description = "Nome do professor para busca", example = "Maria", in = ParameterIn.QUERY)
            @RequestParam(value = "nome", required = false) String nome,

            @Parameter(description = "CPF do professor", example = "12345678901", in = ParameterIn.QUERY)
            @RequestParam(value = "cpf", required = false) String cpf,

            @Parameter(description = "Email do professor", example = "maria@escola.com", in = ParameterIn.QUERY)
            @RequestParam(value = "email", required = false) String email,

            @Parameter(description = "Filtrar por status ativo/inativo", example = "true", in = ParameterIn.QUERY)
            @RequestParam(value = "ativo", required = false) Boolean ativo) {

        List<ProfessorResumoDTO> professores = professorService
                .listarProfessores(id, nome, cpf, email, ativo);

        return ResponseEntity.ok(professores);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar professor por ID (resumido)",
            description = "Retorna dados resumidos usando função PostgreSQL."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Professor encontrado",
                    content = @Content(schema = @Schema(implementation = ProfessorResumoDTO.class)))
    })
    @Doc404NotFound
    public ResponseEntity<ProfessorResumoDTO> buscarPorId(
            @Parameter(description = "Identificador do professor", in = ParameterIn.PATH)
            @PathVariable UUID id) {
        ProfessorResumoDTO response = professorService.buscarPorIdResumido(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/completo")
    @Operation(
            summary = "Buscar professor por ID (completo)",
            description = "Retorna TODOS os dados do professor para edição."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Professor encontrado",
                    content = @Content(schema = @Schema(implementation = ProfessorResponseDTO.class)))
    })
    @Doc404NotFound
    public ResponseEntity<ProfessorResponseDTO> buscarPorIdCompleto(
            @Parameter(description = "Identificador do professor", in = ParameterIn.QUERY)
            @RequestParam("id") UUID id) {
        ProfessorResponseDTO response = professorService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(
            summary = "Cadastrar professor",
            description = "Registra um novo professor."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Professor criado com sucesso")
    })
    @Doc400ValidationError
    public ResponseEntity<ProfessorResponseDTO> criar(@Valid @RequestBody ProfessorRequestDTO dto) {
        ProfessorResponseDTO response = professorService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar professor existente")
    @DocStandardErrors
    public ResponseEntity<ProfessorResponseDTO> atualizar(
            @Parameter(description = "Identificador do professor", in = ParameterIn.PATH)
            @PathVariable UUID id,
            @Valid @RequestBody ProfessorRequestDTO dto) {
        ProfessorResponseDTO response = professorService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/inativar")
    @Operation(summary = "Inativar professor")
    @Doc404NotFound
    public ResponseEntity<ProfessorResponseDTO> inativar(
            @Parameter(description = "Identificador do professor", in = ParameterIn.PATH)
            @PathVariable UUID id) {
        ProfessorResponseDTO response = professorService.inativar(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/ativar")
    @Operation(summary = "Reativar professor")
    @Doc404NotFound
    public ResponseEntity<ProfessorResponseDTO> reativar(
            @Parameter(description = "Identificador do professor", in = ParameterIn.PATH)
            @PathVariable UUID id) {
        ProfessorResponseDTO response = professorService.reativarProfessor(id);
        return ResponseEntity.ok(response);
    }

}
