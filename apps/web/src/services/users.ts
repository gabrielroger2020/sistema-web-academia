import { api } from '@/lib/axios';

export interface User {
  id: string;
  nome: string;
  usuario: string;
  perfil: 'admin' | 'professor' | 'aluno';
  situacao: 'ativo' | 'inativo';
  dtInclusao: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data;
}