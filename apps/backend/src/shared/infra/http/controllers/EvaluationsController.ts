import { Request, Response } from 'express';
import { CreateEvaluationService } from '../../../../modules/evaluations/services/CreateEvaluationService';
import { ListEvaluationsService } from '../../../../modules/evaluations/services/ListEvaluationsService';

export class EvaluationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { idUsuarioAluno, peso, altura } = request.body;

    // O ID do avaliador vem do usuário autenticado no token
    
    const idUsuarioAvaliacao = request.user.id;

    const createEvaluation = new CreateEvaluationService();
    const evaluation = await createEvaluation.execute({
      idUsuarioAluno,
      idUsuarioAvaliacao,
      peso,
      altura,
    });

    return response.status(201).json(evaluation);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const requestingUser = request.user;
    const { alunoId, professorId } = request.query;

    const listEvaluations = new ListEvaluationsService();
    const evaluations = await listEvaluations.execute({
      requestingUser,
      filter: {
        alunoId: alunoId as string | undefined,
        professorId: professorId as string | undefined,
      },
    });

    return response.json(evaluations);
  }
}