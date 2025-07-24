import { hash } from 'bcryptjs';
import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../entities/Usuario';

interface IRequest {
    userId: string;
    nome?: string;
    usuario?: string;
    senha?: string;
    perfil?: 'admin' | 'professor' | 'aluno';
}

export class UpdateUserService {
    public async execute({ userId, nome, usuario, senha, perfil }: IRequest): Promise<Usuario> {
        const usersRepository = AppDataSource.getRepository(Usuario);

        const user = await usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        user.nome = nome ?? user.nome;
        user.usuario = usuario ?? user.usuario;
        user.perfil = perfil ?? user.perfil;

        if (senha) {
            user.senha = await hash(senha, 8);
        }

        await usersRepository.save(user);

        return user;
    }
}