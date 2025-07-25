import { AppDataSource } from '../../../shared/infra/typeorm';
import { AvaliacaoImc } from '../entities/AvaliacaoImc';
import { Usuario } from '../../users/entities/Usuario';

interface IRequest {
  evaluationId: string;
  requestingUser: {
    id: string;
    perfil: Usuario['perfil'];
  };
}

export class DeleteEvaluationService {
  public async execute({ evaluationId, requestingUser }: IRequest): Promise<void> {
    const evaluationsRepository = AppDataSource.getRepository(AvaliacaoImc);

    const evaluation = await evaluationsRepository.findOneBy({ id: evaluationId });
    if (!evaluation) {
      throw new Error('Avaliação não encontrada.');
    }

    // Rule: Teachers can only delete their own assessment. Admins can delete any assessment.
    if (requestingUser.perfil === 'professor' && evaluation.idUsuarioAvaliacao !== requestingUser.id) {
      throw new Error('Acesso negado. Você não tem permissão para excluir esta avaliação.');
    }

    await evaluationsRepository.remove(evaluation);
  }
}