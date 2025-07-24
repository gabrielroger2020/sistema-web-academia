import { Request, Response } from 'express';
import { CreateEvaluationService } from '../../../../modules/evaluations/services/CreateEvaluationService';
import { ListEvaluationsService } from '../../../../modules/evaluations/services/ListEvaluationsService';
import { UpdateEvaluationService } from '../../../../modules/evaluations/services/UpdateEvaluationService';
import { DeleteEvaluationService } from '../../../../modules/evaluations/services/DeleteEvaluationService';

export class EvaluationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { idUsuarioAluno, peso, altura } = request.body;

    // The reviewer ID comes from the authenticated user in the token
    
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

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: evaluationId } = request.params;
    const { peso, altura } = request.body;
    const requestingUser = request.user;

    const updateEvaluation = new UpdateEvaluationService();
    const evaluation = await updateEvaluation.execute({
      evaluationId,
      peso,
      altura,
      requestingUser,
    });
    return response.json(evaluation);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: evaluationId } = request.params;
    const requestingUser = request.user;
    
    const deleteEvaluation = new DeleteEvaluationService();
    await deleteEvaluation.execute({ evaluationId, requestingUser });

    return response.status(204).send();
  }
}