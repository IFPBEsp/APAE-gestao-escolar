--Nova função de listar turmas

-- 1) Função listar_turmas_otimizado
CREATE OR REPLACE FUNCTION public.listar_turmas_otimizado(
    p_id bigint DEFAULT NULL::bigint,
    p_nome character varying DEFAULT NULL::character varying,
    p_ano_criacao integer DEFAULT NULL::integer,
    p_turno character varying DEFAULT NULL::character varying,
    p_tipo character varying DEFAULT NULL::character varying,
    p_is_ativa boolean DEFAULT NULL::boolean,
    p_professor_id bigint DEFAULT NULL::bigint
)
RETURNS json
LANGUAGE plpgsql
AS $function$
DECLARE
    v_result JSON;
BEGIN
    SELECT COALESCE(
               json_agg(
                       json_build_object(
                               'id', t.id,
                               'nome', t.nome,
                               'anoCriacao', t.ano_criacao,
                               'turno', t.turno,
                               'tipo', t.tipo,
                               'isAtiva', t.is_ativa,
                               'professorNome', p.nome,
                               'professorId', t.professor_id,
                               'totalAlunos', COALESCE(stats.total, 0),
                               'totalAlunosAtivos', COALESCE(stats.ativos, 0),
                               'horario', CASE
                                              WHEN UPPER(t.turno) = 'MANHA' THEN 'Segunda a Sexta - 8h as 12h'
                                              WHEN UPPER(t.turno) = 'TARDE' THEN 'Segunda a Sexta - 14h as 18h'
                                              ELSE 'Horário não definido'
                                   END
                       )
                           ORDER BY t.ano_criacao DESC, t.nome ASC
               ),
               '[]'::json
       ) INTO v_result
    FROM turmas t
         LEFT JOIN professores p ON t.professor_id = p.id
         LEFT JOIN LATERAL (
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE is_aluno_ativo = true) as ativos
            FROM turma_aluno ta
            WHERE ta.turma_id = t.id
         ) stats ON true
    WHERE
        (p_id IS NULL OR t.id = p_id)
      AND (p_nome IS NULL OR LOWER(t.nome) LIKE LOWER('%' || p_nome || '%'))
      AND (p_ano_criacao IS NULL OR t.ano_criacao = p_ano_criacao)
      AND (p_turno IS NULL OR LOWER(t.turno) = LOWER(p_turno))
      AND (p_tipo IS NULL OR LOWER(t.tipo) LIKE LOWER('%' || p_tipo || '%'))
      AND (p_is_ativa IS NULL OR t.is_ativa = p_is_ativa)
      AND (p_professor_id IS NULL OR t.professor_id = p_professor_id);

    RETURN v_result;
END;
$function$;