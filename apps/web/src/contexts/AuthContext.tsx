import { createContext, ReactNode, useContext, useState } from 'react';
import { api } from '@/lib/axios';

interface User {
  id: string;
  nome: string;
  usuario: string;
  perfil: 'admin' | 'professor' | 'aluno';
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (credentials: any) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  async function signIn({ usuario, senha }: any) {
      const response = await api.post('/sessions', {
        usuario,
        senha,
      });

      const { user: userData, token } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);