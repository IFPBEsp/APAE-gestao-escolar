'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  id: number;
  nome?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  professorId: number | null;
  loading: boolean;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera usuário do localStorage ao carregar a página
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('usuarioLogado');
      }
    }
    setLoading(false);
  }, []);

  const login = (novoUsuario: Usuario) => {
    setUsuario(novoUsuario);
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'role=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        professorId: usuario?.id || null,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}