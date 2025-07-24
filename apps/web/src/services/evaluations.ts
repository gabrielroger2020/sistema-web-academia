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
  const response = await api.get('/evaluations', { params });
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