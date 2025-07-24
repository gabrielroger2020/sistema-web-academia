import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  signOut: () => void; // Add signOut
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isAuthenticated = !!user;

    useEffect(() => {
        const token = localStorage.getItem('sooro.token');
        const userJson = localStorage.getItem('sooro.user');

        if (token && userJson) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(JSON.parse(userJson));
        }
        setLoading(false);
    }, []);

    async function signIn({ usuario, senha }: any) {
        const response = await api.post('/sessions', { usuario, senha });
        const { user: userData, token } = response.data;

        localStorage.setItem('sooro.token', token);
        localStorage.setItem('sooro.user', JSON.stringify(userData));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        router.push('/dashboard');
    }

    function signOut() {

        localStorage.removeItem('sooro.token');
        localStorage.removeItem('sooro.user');

        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        router.push('/');
    }

    if (loading) {
      return null;
    }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);