package com.apae.gestao.controller;

import java.util.List;

import com.apae.gestao.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.apae.gestao.dto.ApiErrorResponse;
import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turmaAluno.TurmaAlunoResponseDTO;
import com.apae.gestao.service.TurmaService;

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
@Tag(name = "Turmas", description = "Gerenciamento de turmas e vínculos com professores/alunos.")
@SecurityRequirement(name = "bearerAuth")
public class TurmaController {

    @Autowired
    private TurmaService service;

    @PostMapping
    @Operation(summary = "Criar turma", description = "Cria uma nova turma vinculando professor e alunos por ID.")
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
                          "isAtiva": true,
                          "professor": { "id": 2, "nome": "Maria da Silva" },
                          "alunosIds": [1, 2, 3]
                        }
                        """))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content(
                    schema = @Schema(implementation = ApiErrorResponse.class)))
    })
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
                    content = @Content(schema = @Schema(implementation = TurmaResumoDTO.class))),
            @ApiResponse(responseCode = "404", description = "Turma não encontrada")
    })
    public ResponseEntity<TurmaResumoDTO> buscarPorId(
            @Parameter(description = "Identificador da turma", example = "7", in = ParameterIn.PATH)
            @PathVariable Long id) {
        TurmaResumoDTO response = service.buscarTurmaResumidaPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(
            summary = "Listar turmas (OTIMIZADO com PostgreSQL)",
            description = "Usa função PostgreSQL nativa. Retorna dados resumidos: id, nome, turno, professorNome, totalAlunos. " +
                    "Suporta filtros por: id, nome, anoCriacao, turno, tipo, isAtiva, professorId."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de turmas retornada com sucesso")
    })
    public ResponseEntity<List<TurmaResumoDTO>> listarTodas(
            @Parameter(description = "ID da turma", example = "7", in = ParameterIn.QUERY)
            @RequestParam(value = "id", required = false) Long id,

            @Parameter(description = "Nome da turma para busca", example = "Alfabetização", in = ParameterIn.QUERY)
            @RequestParam(value = "nome", required = false) String nome,

            @Parameter(description = "Ano de criação", example = "2025", in = ParameterIn.QUERY)
            @RequestParam(value = "anoCriacao", required = false) Integer anoCriacao,

            @Parameter(description = "Turno (MANHA, TARDE, NOITE)", example = "MANHA", in = ParameterIn.QUERY)
            @RequestParam(value = "turno", required = false) String turno,

            @Parameter(description = "Tipo pedagógico", example = "Educação Especial", in = ParameterIn.QUERY)
            @RequestParam(value = "tipo", required = false) String tipo,

            @Parameter(description = "Filtrar por status ativo/inativo", example = "true", in = ParameterIn.QUERY)
            @RequestParam(value = "isAtiva", required = false) Boolean isAtiva,

            @Parameter(description = "ID do professor", example = "12", in = ParameterIn.QUERY)
            @RequestParam(value = "professorId", required = false) Long professorId) {

        List<TurmaResumoDTO> turmas = service.listarTurmas(
                id, nome, anoCriacao, turno, tipo, isAtiva, professorId
        );

        return ResponseEntity.ok(turmas);
    }



    @PutMapping("/{turmaId}")
    @Operation(summary = "Atualizar turma existente")
    public ResponseEntity<TurmaResponseDTO> atualizar(
            @Parameter(description = "Identificador da turma", example = "5", in = ParameterIn.PATH)
            @PathVariable Long turmaId,
            @Valid @RequestBody TurmaRequestDTO dto){
        TurmaResponseDTO response = service.atualizar(turmaId, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir turma definitivamente")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "Identificador da turma", example = "5", in = ParameterIn.PATH)
            @PathVariable Long id){
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{turmaId}/professor/{professorId}")
    @Operation(summary = "Vincular professor a uma turma específica")
    public ResponseEntity<TurmaResponseDTO> atribuirProfessor(
            @Parameter(description = "Identificador da turma", example = "5", in = ParameterIn.PATH)
            @PathVariable Long turmaId,
            @Parameter(description = "Identificador do professor", example = "12", in = ParameterIn.PATH)
            @PathVariable Long professorId
    ){
        TurmaResponseDTO atualizado = service.vincularProfessoresATurma(turmaId, professorId);
        return ResponseEntity.ok(atualizado);
    }

    @PatchMapping("/{turmaId}/ativar")
    @Operation(summary = "Ativar turma")
    public ResponseEntity<TurmaResponseDTO> ativarTurma(
            @Parameter(description = "Identificador da turma", example = "5", in = ParameterIn.PATH)
            @PathVariable Long turmaId) {
        TurmaResponseDTO response = service.ativarTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{turmaId}/desativar")
    @Operation(summary = "Desativar turma")
    public ResponseEntity<TurmaResponseDTO> desativarTurma(
            @Parameter(description = "Identificador da turma", example = "5", in = ParameterIn.PATH)
            @PathVariable Long turmaId) {
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