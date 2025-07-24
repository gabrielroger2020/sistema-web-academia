import { api } from '@/lib/axios';

export interface Evaluation {
    id: string;
    altura: number;
    peso: number;
    imc: number;
    classificacao: string;
    dtInclusao: string;
    aluno: {
        id: string;
        nome: string;
    };
    avaliador: {
        id: string;
        nome: string;
    };
}

export async function getEvaluations(params?: { alunoId?: string, professorId?: string }): Promise<Evaluation[]> {
    const requestParams: { [key: string]: string } = {};

    if (params?.alunoId) {
        requestParams.alunoId = params.alunoId;
    }
    if (params?.professorId) {
        requestParams.professorId = params.professorId;
    }
    
    const response = await api.get('/evaluations', { params: requestParams });
    return response.data;
}

export interface CreateEvaluationData {
    idUsuarioAluno: string;
    peso: number;
    altura: number;
}

export async function createEvaluation(data: CreateEvaluationData): Promise<Evaluation> {
    const response = await api.post('/evaluations', data);
    return response.data;
}

export interface UpdateEvaluationData {
  evaluationId: string;
  data: {
    peso?: number;
    altura?: number;
  };
}

export async function updateEvaluation({ evaluationId, data }: UpdateEvaluationData): Promise<Evaluation> {
  const response = await api.put(`/evaluations/${evaluationId}`, data);
  return response.data;
}

export async function deleteEvaluation(evaluationId: string): Promise<void> {
  await api.delete(`/evaluations/${evaluationId}`);
}