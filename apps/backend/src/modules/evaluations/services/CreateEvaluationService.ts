import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../../users/entities/Usuario';
import { AvaliacaoImc } from '../entities/AvaliacaoImc';
import { calculateIMC } from '../utils/imcCalculator';

interface IRequest {
  idUsuarioAluno: string;
  idUsuarioAvaliacao: string;
  peso: number;
  altura: number;
}

export class CreateEvaluationService {
  public async execute({
    idUsuarioAluno,
    idUsuarioAvaliacao,
    peso,
    altura,
  }: IRequest): Promise<AvaliacaoImc> {
    const usersRepository = AppDataSource.getRepository(Usuario);
    const evaluationsRepository = AppDataSource.getRepository(AvaliacaoImc);

    // Valida se o aluno existe e está ativo
    const aluno = await usersRepository.findOneBy({ id: idUsuarioAluno, situacao: 'ativo' });
    if (!aluno || aluno.perfil !== 'aluno') {
      throw new Error('Aluno não encontrado ou inativo.');
    }
    
    // Regra de negócio: usuários inativos não podem ter novas avaliações
    if(aluno.situacao === 'inativo') {
        throw new Error('Não é possível cadastrar avaliação para um aluno inativo.');
    }

    const { imc, classificacao } = calculateIMC(peso, altura);

    const evaluation = evaluationsRepository.create({
      idUsuarioAluno,
      idUsuarioAvaliacao,
      peso,
      altura,
      imc,
      classificacao,
    });

    await evaluationsRepository.save(evaluation);

    return evaluation;
  }
}