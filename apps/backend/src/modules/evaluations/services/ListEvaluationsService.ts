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

        // Professor pode ver as avaliações que ele mesmo cadastrou.
        query.andWhere('avaliacao.idUsuarioAvaliacao = :professorId', { professorId: requestingUser.id });

        // E pode filtrar por um aluno específico dentro das suas avaliações.
        if (filter?.alunoId) {
            query.andWhere('avaliacao.idUsuarioAluno = :alunoId', { alunoId: filter.alunoId });
        }
        break;

      case 'aluno':

        // Aluno só pode ver suas próprias avaliações.
        query.andWhere('avaliacao.idUsuarioAluno = :alunoId', { alunoId: requestingUser.id });
        break;
    }

    return await query.orderBy('avaliacao.dtInclusao', 'DESC').getMany();
  }
}