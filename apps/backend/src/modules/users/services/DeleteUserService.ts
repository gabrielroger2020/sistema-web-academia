import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../entities/Usuario';
import { AvaliacaoImc } from '../../evaluations/entities/AvaliacaoImc';

export class DeleteUserService {
  public async execute(userId: string): Promise<void> {
    const usersRepository = AppDataSource.getRepository(Usuario);
    const evaluationsRepository = AppDataSource.getRepository(AvaliacaoImc);

    const user = await usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const hasEvaluations = await evaluationsRepository.findOne({
      where: [
        { idUsuarioAluno: userId },
        { idUsuarioAvaliacao: userId },
      ],
    });

    if (hasEvaluations) {
      throw new Error('Não é possível excluir um usuário com avaliações vinculadas.');
    }

    await usersRepository.remove(user);
  }
}