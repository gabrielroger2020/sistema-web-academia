import { AppDataSource } from '../../../shared/infra/typeorm';
import { AvaliacaoImc } from '../entities/AvaliacaoImc';
import { calculateIMC } from '../utils/imcCalculator';
import { Usuario } from '../../users/entities/Usuario';

interface IRequest {
  evaluationId: string;
  peso?: number;
  altura?: number;
  requestingUser: {
    id: string;
    perfil: Usuario['perfil'];
  };
}

export class UpdateEvaluationService {
  public async execute({ evaluationId, peso, altura, requestingUser }: IRequest): Promise<AvaliacaoImc> {
    const evaluationsRepository = AppDataSource.getRepository(AvaliacaoImc);

    const evaluation = await evaluationsRepository.findOneBy({ id: evaluationId });
    if (!evaluation) {
      throw new Error('Avaliação não encontrada.');
    }

    // Rule: Teachers can only edit their own assessment. Admins can edit any assessment.
    if (requestingUser.perfil === 'professor' && evaluation.idUsuarioAvaliacao !== requestingUser.id) {
      throw new Error('Acesso negado. Você não tem permissão para editar esta avaliação.');
    }

    // Updates values if provided
    evaluation.peso = peso ?? evaluation.peso;
    evaluation.altura = altura ?? evaluation.altura;

    // Recalculates BMI if weight or height has changed
    if (peso || altura) {
      const { imc, classificacao } = calculateIMC(evaluation.peso, evaluation.altura);
      evaluation.imc = imc;
      evaluation.classificacao = classificacao;
    }

    await evaluationsRepository.save(evaluation);
    return evaluation;
  }
}