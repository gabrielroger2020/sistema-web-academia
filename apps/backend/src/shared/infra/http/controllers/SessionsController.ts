import { Request, Response } from 'express';
import { AuthenticateUserService } from '../../../../modules/users/services/AuthenticateUserService';

export class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { usuario, senha } = request.body;
      const authenticateUser = new AuthenticateUserService();

      const { user, token } = await authenticateUser.execute({
        usuario,
        senha,
      });

      return response.json({ user, token });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}