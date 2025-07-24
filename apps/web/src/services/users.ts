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

export interface UpdateUserData {
    userId: string;
    data: Partial<CreateUserData>;
}

interface UpdateUserStatusData {
    userId: string;
    status: 'ativo' | 'inativo';
}

export async function getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
}

export async function updateUserStatus({ userId, status }: UpdateUserStatusData): Promise<User> {
    const response = await api.patch(`/users/${userId}/status`, { situacao: status });
    return response.data;
}

export async function updateUser({ userId, data }: UpdateUserData): Promise<User> {
    if (data.senha === '') {
        delete data.senha;
    }
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
}

export async function deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
}