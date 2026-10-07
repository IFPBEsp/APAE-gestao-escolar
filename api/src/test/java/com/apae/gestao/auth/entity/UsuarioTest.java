package com.apae.gestao.auth.entity;

import com.apae.gestao.entity.Usuario;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UsuarioTest {

    @Test
    void deveCriarUsuarioComDadosInformados() {
        UUID enderecoId = UUID.randomUUID();

        Usuario usuario = new Usuario(
                UUID.randomUUID(),
                "usuario@teste.com",
                "Usuário Teste",
                "senha123",
                "12345678900",
                "GESTAO_ESCOLAR",
                "(83) 99999-9999",
                enderecoId,
                true
        );

        assertEquals("usuario@teste.com", usuario.getEmail());
        assertEquals("Usuário Teste", usuario.getNomeCompleto());
        assertEquals("senha123", usuario.getSenha());
        assertEquals("12345678900", usuario.getCpf());
        assertEquals("GESTAO_ESCOLAR", usuario.getCargo());
        assertEquals("(83) 99999-9999", usuario.getTelefone());
        assertEquals(enderecoId, usuario.getEnderecoId());
        assertTrue(usuario.getAtivo());
    }

    @Test
    void deveIniciarUsuarioComoAtivo() {
        Usuario usuario = new Usuario();

        assertTrue(usuario.getAtivo());
    }

    @Test
    void deveAtivarUsuarioQuandoAtivoForNulo() throws Exception {
        Usuario usuario = new Usuario();

        usuario.setAtivo(null);

        var metodoInit = Usuario.class.getDeclaredMethod("init");
        metodoInit.setAccessible(true);
        metodoInit.invoke(usuario);

        assertTrue(usuario.getAtivo());
    }

    @Test
    void naoDeveAlterarUsuarioQuandoAtivoForFalse() throws Exception {
        Usuario usuario = new Usuario();

        usuario.setAtivo(false);

        var metodoInit = Usuario.class.getDeclaredMethod("init");
        metodoInit.setAccessible(true);
        metodoInit.invoke(usuario);

        assertFalse(usuario.getAtivo());
    }
}
