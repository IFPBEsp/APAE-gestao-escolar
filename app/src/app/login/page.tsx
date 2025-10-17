import styles from '@/components/PageTheme.module.css';

export default function LoginPage() {
  return (
    <div className={styles.mainPage}>
      {/* Header com Logo APAE */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoImage}>
            <img src="/logo.APAE.jpg" alt="APAE" className={styles.logoImg} />
          </div>
        </div>
        <p className={styles.subtitle}>Sistema de Gestão Escolar</p>
      </div>

      {/* Formulário de Login */}
      <div className={styles.formContainer}>
        <div className={styles.card}>
          <h2 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Login</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', margin: '0 0 2rem 0' }}>Essa página ainda está em construção.</p>
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => window.history.back()} 
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
