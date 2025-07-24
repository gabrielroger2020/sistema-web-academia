import { Request, Response } from 'express';
import { CreateUserService } from '../../../../modules/users/services/CreateUserService';
import { ListUsersService } from '../../../../modules/users/services/ListUsersService';
import { UpdateUserStatusService } from '../../../../modules/users/services/UpdateUserStatusService';
import { UpdateUserService } from '../../../../modules/users/services/UpdateUserService';
import { DeleteUserService } from '../../../../modules/users/services/DeleteUserService';


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

  public async list(request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService();
    let users = await listUsers.execute();
    if (request.user.perfil === 'professor') {
      users = users.filter(user => user.perfil === 'aluno');
    }
    return response.json(users);
  }

  public async updateStatus(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { situacao } = request.body;
    const updateUserStatus = new UpdateUserStatusService();
    const user = await updateUserStatus.execute({ userId: id, situacao });
    const { senha: _, ...userWithoutPassword } = user;
    return response.json(userWithoutPassword);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { nome, usuario, senha, perfil } = request.body;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      userId: id,
      nome,
      usuario,
      senha,
      perfil,
    });

    const { senha: _, ...userWithoutPassword } = user;

    return response.json(userWithoutPassword);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteUser = new DeleteUserService();
    await deleteUser.execute(id);
    return response.status(204).send();
  }
}