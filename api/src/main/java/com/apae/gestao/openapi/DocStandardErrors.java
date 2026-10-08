package com.apae.gestao.openapi;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Combinação padrão de erros 400 (validação) e 404 (recurso não encontrado).
 * Útil para endpoints que recebem corpo válido e operam sobre um recurso por ID.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Doc400ValidationError
@Doc404NotFound
public @interface DocStandardErrors {
}

