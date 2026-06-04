package com.apae.gestao.dto.professor;

import com.apae.gestao.entity.Endereco;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Endereço vinculado ao usuário do professor.")
public class EnderecoDTO {

    @Size(max = 255, message = "Cidade deve ter no máximo 255 caracteres")
    private String cidade;

    @Size(max = 255, message = "CEP deve ter no máximo 255 caracteres")
    private String cep;

    @Size(max = 255, message = "Estado deve ter no máximo 255 caracteres")
    private String estado;

    @Size(max = 255, message = "Bairro deve ter no máximo 255 caracteres")
    private String bairro;

    @Size(max = 255, message = "Rua deve ter no máximo 255 caracteres")
    private String rua;

    @Size(max = 255, message = "Número deve ter no máximo 255 caracteres")
    private String numero;

    @Size(max = 255, message = "Complemento deve ter no máximo 255 caracteres")
    private String complemento;

    public static EnderecoDTO fromEntity(Endereco endereco) {
        if (endereco == null) {
            return null;
        }
        return new EnderecoDTO(
                endereco.getCidade(),
                endereco.getCep(),
                endereco.getEstado(),
                endereco.getBairro(),
                endereco.getRua(),
                endereco.getNumero(),
                endereco.getComplemento()
        );
    }
}
