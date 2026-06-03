package com.apae.gestao.dto.professor;

import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados completos retornados após operações com professores.")
public class ProfessorResponseDTO {

    @Schema(description = "Identificador único do professor")
    private UUID id;

    @Schema(description = "Identificador do usuário vinculado ao professor")
    private UUID usuarioId;

    @Schema(description = "Nome completo do professor", example = "Maria da Silva")
    private String nome;

    @Schema(description = "CPF armazenado", example = "12345678901")
    private String cpf;

    @Schema(description = "E-mail institucional", example = "maria.silva@apae.org.br")
    private String email;

    @Schema(description = "Telefone cadastrado", example = "(11) 98888-0000")
    private String telefone;

    @Schema(description = "Data de nascimento", example = "1990-05-12")
    private LocalDate dataNascimento;

    @Schema(description = "Formação acadêmica", example = "Licenciatura em Educação Especial")
    private String formacao;

    @Schema(description = "Data de contratação", example = "2024-02-01")
    private LocalDate dataContratacao;

    @Schema(description = "Endereço completo", example = "Av. Brasil, 1000 - Centro, Recife/PE")
    private String endereco;

    @Schema(description = "Indica se o professor está ativo no sistema", example = "true")
    private Boolean ativo;

    @Schema(description = "Indica se o professor ainda precisa concluir o primeiro acesso", example = "true")
    private Boolean primeiroAcesso;

    public ProfessorResponseDTO(Professor professor, Usuario usuario) {
        this.id = professor.getId();
        this.usuarioId = professor.getUsuarioId();
        this.nome = usuario.getNomeCompleto();
        this.cpf = usuario.getCpf();
        this.email = usuario.getEmail();
        this.telefone = usuario.getTelefone();
        this.dataNascimento = professor.getDataNascimento();
        this.formacao = professor.getFormacao();
        this.dataContratacao = professor.getDataContratacao();
        this.endereco = usuario.getEndereco();
        this.ativo = usuario.getAtivo();
        this.primeiroAcesso = professor.getPrimeiroAcesso();
    }
}
