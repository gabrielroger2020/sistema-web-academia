import { api } from '@/lib/axios';

export interface User {
    id: string;
    nome: string;
    usuario: string;
    perfil: 'admin' | 'professor' | 'aluno';
    situacao: 'ativo' | 'inativo';
    dtInclusao: string;
}

export interface CreateUserData {
    nome: string;
    usuario: string;
    senha: string;
    perfil: 'admin' | 'professor' | 'aluno';
}

export async function getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
}