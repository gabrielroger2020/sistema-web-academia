import { Request, Response } from 'express';
import { CreateUserService } from '../../../../modules/users/services/CreateUserService';

export class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { nome, usuario, senha, perfil } = request.body;
      const createUserService = new CreateUserService();

      const user = await createUserService.execute({
        nome,
        usuario,
        senha,
        perfil,
      });

      const userResponse = {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        perfil: user.perfil,
        situacao: user.situacao,
        dtInclusao: user.dtInclusao,
      };

      return response.status(201).json(userResponse);
    } catch (error) {
        if (error instanceof Error) {
             return response.status(400).json({ error: error.message });
        }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}