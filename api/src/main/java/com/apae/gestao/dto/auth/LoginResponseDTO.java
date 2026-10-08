package com.apae.gestao.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Resposta do login contendo o token JWT e o papel do usuário.")
public class LoginResponseDTO {
    private String token;
    private String role;
    private UUID id;
}
