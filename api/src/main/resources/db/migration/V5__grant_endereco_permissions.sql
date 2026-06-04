DO $$
DECLARE
    app_user text := current_user;
BEGIN
    EXECUTE format(
        'GRANT SELECT, INSERT, UPDATE ON TABLE apae_geral.enderecos TO %I',
        app_user
    );
END $$;
