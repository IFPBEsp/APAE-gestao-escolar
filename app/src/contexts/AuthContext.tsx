'use client'

import { createContext, useContext, useMemo, useSyncExternalStore, ReactNode } from 'react';

interface Usuario {
  id: string;
  nome?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  professorId: string | null;
  loading: boolean;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeAuth(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("apae-auth-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("apae-auth-change", onChange);
  };
}

const getUsuarioSnapshot = () => localStorage.getItem("usuarioLogado");
const getServerUsuarioSnapshot = () => null;
const getClientReady = () => true;
const getServerReady = () => false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const usuarioSalvo = useSyncExternalStore(subscribeAuth, getUsuarioSnapshot, getServerUsuarioSnapshot);
  const hydrated = useSyncExternalStore(subscribeAuth, getClientReady, getServerReady);
  const loading = !hydrated;
  const usuario = useMemo<Usuario | null>(() => {
    if (!usuarioSalvo) return null;
    try {
      return JSON.parse(usuarioSalvo) as Usuario;
    } catch {
      return null;
    }
  }, [usuarioSalvo]);

  const login = (novoUsuario: Usuario) => {
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
    window.dispatchEvent(new Event('apae-auth-change'));
  };

  const logout = () => {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'role=; path=/; max-age=0';
    window.dispatchEvent(new Event('apae-auth-change'));
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        professorId: usuario?.id ?? null,
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
