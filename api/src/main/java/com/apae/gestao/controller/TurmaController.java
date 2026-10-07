package com.apae.gestao.controller;

import java.util.List;
import java.util.UUID;

import com.apae.gestao.dto.turma.TurmaResumoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turmaAluno.TurmaAlunoResponseDTO;
import com.apae.gestao.service.TurmaService;
import com.apae.gestao.openapi.Doc400ValidationError;
import com.apae.gestao.openapi.Doc404NotFound;
import com.apae.gestao.openapi.DocStandardErrors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/turmas")
@Tag(name = "Turmas", description = "Gerenciamento de turmas e vínculos com alunos.")
@SecurityRequirement(name = "bearerAuth")
public class TurmaController {

    @Autowired
    private TurmaService service;

    @PostMapping
    @Operation(summary = "Criar turma", description = "Cria uma nova turma e vincula pacientes por ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Turma criada", content = @Content(
                    schema = @Schema(implementation = TurmaResponseDTO.class),
                    examples = @ExampleObject(name = "TurmaCriada", value = """
                        {
                          "id": 10,
                          "nome": "Alfabetização 2025 - Manhã",
                          "anoCriacao": 2025,
                          "turno": "MANHA",
                          "tipo": "Educação Especial",
                          "ativa": true,
                          "alunosIds": ["9de17e76-0b98-4751-9331-5f39e4bcb534"]
                        }
                        """)))
    })
    @Doc400ValidationError
    public ResponseEntity<TurmaResponseDTO> criar(@Valid @RequestBody TurmaRequestDTO dto){
        TurmaResponseDTO response = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar turma por ID (resumida)",
            description = "Retorna dados resumidos usando função PostgreSQL."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Turma encontrada",
                    content = @Content(schema = @Schema(implementation = TurmaResumoDTO.class)))
    })
    @Doc404NotFound
    public ResponseEntity<TurmaResumoDTO> buscarPorId(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH)
            @PathVariable UUID id) {
        TurmaResumoDTO response = service.buscarTurmaResumidaPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(
            summary = "Listar turmas",
            description = "Retorna dados resumidos. Suporta filtros por: id, nome, anoCriacao, turno, tipo e ativa."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de turmas retornada com sucesso")
    })
    public ResponseEntity<List<TurmaResumoDTO>> listarTodas(
            @Parameter(description = "ID da turma", in = ParameterIn.QUERY)
            @RequestParam(value = "id", required = false) UUID id,

            @Parameter(description = "Nome da turma para busca", example = "Alfabetização", in = ParameterIn.QUERY)
            @RequestParam(value = "nome", required = false) String nome,

            @Parameter(description = "Ano de criação", example = "2025", in = ParameterIn.QUERY)
            @RequestParam(value = "anoCriacao", required = false) Integer anoCriacao,

            @Parameter(description = "Turno (MANHA, TARDE, NOITE)", example = "MANHA", in = ParameterIn.QUERY)
            @RequestParam(value = "turno", required = false) String turno,

            @Parameter(description = "Tipo pedagógico", example = "Educação Especial", in = ParameterIn.QUERY)
            @RequestParam(value = "tipo", required = false) String tipo,

            @Parameter(description = "Filtrar por status ativo/inativo", example = "true", in = ParameterIn.QUERY)
            @RequestParam(value = "ativa", required = false) Boolean ativa) {

        List<TurmaResumoDTO> turmas = service.listarTurmas(
                id, nome, anoCriacao, turno, tipo, ativa
        );

        return ResponseEntity.ok(turmas);
    }



    @PutMapping("/{turmaId}")
    @Operation(summary = "Atualizar turma existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Turma atualizada com sucesso",
                    content = @Content(schema = @Schema(implementation = TurmaResponseDTO.class)))
    })
    @DocStandardErrors
    public ResponseEntity<TurmaResponseDTO> atualizar(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH)
            @PathVariable UUID turmaId,
            @Valid @RequestBody TurmaRequestDTO dto){
        TurmaResponseDTO response = service.atualizar(turmaId, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir turma definitivamente")
    @Doc404NotFound
    public ResponseEntity<Void> deletar(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH)
            @PathVariable UUID id){
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{turmaId}/ativar")
    @Operation(summary = "Ativar turma")
    @Doc404NotFound
    public ResponseEntity<TurmaResponseDTO> ativarTurma(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH)
            @PathVariable UUID turmaId) {
        TurmaResponseDTO response = service.ativarTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{turmaId}/desativar")
    @Operation(summary = "Desativar turma")
    @Doc404NotFound
    public ResponseEntity<TurmaResponseDTO> desativarTurma(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH)
            @PathVariable UUID turmaId) {
        TurmaResponseDTO response = service.desativarTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{turmaId}/professor/{professorId}")
    @Operation(summary = "Atribuir professor à turma", description = "Associa um professor responsável por uma turma.")
    @DocStandardErrors
    public ResponseEntity<TurmaResponseDTO> adicionarProfessor(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH) @PathVariable UUID turmaId,
            @Parameter(description = "Identificador do professor", in = ParameterIn.PATH) @PathVariable UUID professorId) {
        TurmaResponseDTO response = service.adicionarProfessor(turmaId, professorId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{turmaId}/professor")
    @Operation(summary = "Remover professor da turma", description = "Remove o professor responsável por uma turma.")
    @DocStandardErrors
    public ResponseEntity<TurmaResponseDTO> removerProfessor(
            @Parameter(description = "Identificador da turma", in = ParameterIn.PATH) @PathVariable UUID turmaId) {
        TurmaResponseDTO response = service.removerProfessor(turmaId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{turmaId}/alunos")
    @Operation(
            summary = "Adicionar alunos à turma",
            description = "Adiciona uma lista de alunos já cadastrados a uma turma existente."
    )
    @DocStandardErrors
    public ResponseEntity<TurmaResponseDTO> adicionarAlunos(@RequestBody List<UUID> alunosId, @PathVariable UUID turmaId){
        TurmaResponseDTO response = service.adicionarAlunos(turmaId, alunosId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{turmaId}/alunos")
    @Operation(
            summary = "Listar alunos da turma",
            description = "Lista todos os alunos, ativos e inativos, vinculados à turma."
    )
    @Doc404NotFound
    public ResponseEntity<List<TurmaAlunoResponseDTO>> listarAlunosNaTurma(@PathVariable UUID turmaId){
        List<TurmaAlunoResponseDTO> response = service.listarAlunos(turmaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{turmaId}/alunos/ativos")
    @Operation(
            summary = "Listar alunos ativos da turma",
            description = "Lista apenas os alunos com vínculo ativo na turma."
    )
    @Doc404NotFound
    public ResponseEntity<List<TurmaAlunoResponseDTO>> listarAlunosAtivosNaTurma(@PathVariable UUID turmaId){
        List<TurmaAlunoResponseDTO> response = service.listarAlunosAtivos(turmaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{turmaId}/alunos/inativos")
    @Operation(
            summary = "Listar alunos inativos da turma",
            description = "Lista apenas os alunos com vínculo inativo na turma."
    )
    @Doc404NotFound
    public ResponseEntity<List<TurmaAlunoResponseDTO>> listarAlunosInativosNaTurma(@PathVariable UUID turmaId){
        List<TurmaAlunoResponseDTO> response = service.listarAlunosInativos(turmaId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{turmaId}/alunos/{alunoId}/ativar")
    @Operation(
            summary = "Ativar aluno na turma",
            description = "Reativa o vínculo do aluno com a turma para participação nas atividades."
    )
    @Doc404NotFound
    public ResponseEntity<TurmaAlunoResponseDTO> ativarAlunoNaTurma(@PathVariable UUID turmaId, @PathVariable UUID alunoId){
        service.ativarAluno(turmaId, alunoId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{turmaId}/alunos/{alunoId}/inativar")
    @Operation(
            summary = "Inativar aluno na turma",
            description = "Inativa o vínculo do aluno com a turma, mantendo o histórico preservado."
    )
    @Doc404NotFound
    public ResponseEntity<TurmaAlunoResponseDTO> desativarAlunoNaTurma(@PathVariable UUID turmaId, @PathVariable UUID alunoId){
        service.desativarAluno(turmaId, alunoId);
        return ResponseEntity.ok().build();
    }
}
