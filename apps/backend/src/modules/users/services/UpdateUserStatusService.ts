import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../entities/Usuario';

interface IRequest {
  userId: string;
  situacao: 'ativo' | 'inativo';
}

export class UpdateUserStatusService {
  public async execute({ userId, situacao }: IRequest): Promise<Usuario> {
    const usersRepository = AppDataSource.getRepository(Usuario);
    const user = await usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    user.situacao = situacao;
    await usersRepository.save(user);
    return user;
  }
}