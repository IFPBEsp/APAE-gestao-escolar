DO $$
BEGIN
    EXECUTE format(
        'GRANT SELECT, INSERT, UPDATE ON TABLE apae_geral.usuarios TO %I',
        current_user
    );
END $$;
