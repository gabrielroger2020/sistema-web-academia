import { AppDataSource } from '../../../shared/infra/typeorm';
import { AvaliacaoImc } from '../entities/AvaliacaoImc';
import { Usuario } from '../../users/entities/Usuario';

interface IRequest {
  requestingUser: {
    id: string;
    perfil: Usuario['perfil'];
  };
  filter?: {
    alunoId?: string;
    professorId?: string;
  };
}

export class ListEvaluationsService {
  public async execute({ requestingUser, filter }: IRequest): Promise<AvaliacaoImc[]> {
    const evaluationsRepository = AppDataSource.getRepository(AvaliacaoImc);
    const query = evaluationsRepository.createQueryBuilder('avaliacao')
      .leftJoinAndSelect('avaliacao.aluno', 'aluno')
      .leftJoinAndSelect('avaliacao.avaliador', 'avaliador')
      .select([
        'avaliacao.id', 'avaliacao.altura', 'avaliacao.peso', 'avaliacao.imc', 'avaliacao.classificacao', 'avaliacao.dtInclusao',
        'aluno.id', 'aluno.nome',
        'avaliador.id', 'avaliador.nome',
      ]);

    switch (requestingUser.perfil) {
      case 'admin':
        if (filter?.alunoId) {
          query.andWhere('avaliacao.idUsuarioAluno = :alunoId', { alunoId: filter.alunoId });
        }
        if (filter?.professorId) {
          query.andWhere('avaliacao.idUsuarioAvaliacao = :professorId', { professorId: filter.professorId });
        }
        break;
      
      case 'professor':

        // Teacher can see the evaluations that he himself registered.
        query.andWhere('avaliacao.idUsuarioAvaliacao = :professorId', { professorId: requestingUser.id });

        // And you can filter by a specific student within your assessments.
        if (filter?.alunoId) {
            query.andWhere('avaliacao.idUsuarioAluno = :alunoId', { alunoId: filter.alunoId });
        }
        break;

      case 'aluno':

        // Student can only see their own evaluations.
        query.andWhere('avaliacao.idUsuarioAluno = :alunoId', { alunoId: requestingUser.id });
        break;
    }

    return await query.orderBy('avaliacao.dtInclusao', 'DESC').getMany();
  }
}