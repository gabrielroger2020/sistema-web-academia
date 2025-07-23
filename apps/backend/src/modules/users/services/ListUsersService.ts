import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../entities/Usuario';

export class ListUsersService {
  public async execute(): Promise<Omit<Usuario, 'senha'>[]> {
    const usersRepository = AppDataSource.getRepository(Usuario);

    const users = await usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.nome',
        'user.usuario',
        'user.perfil',
        'user.situacao',
        'user.dtInclusao',
      ])
      .getMany();
    return users;
  }
}