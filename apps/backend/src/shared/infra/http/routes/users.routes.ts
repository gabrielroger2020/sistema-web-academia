import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { UsersController } from '../controllers/UsersController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAdminOrProfessor } from '../middlewares/ensureAdminOrProfessor';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      nome: Joi.string().required(),
      usuario: Joi.string().required(),
      senha: Joi.string().min(6).required(),
      perfil: Joi.string().valid('admin', 'professor', 'aluno').required(),
    },
  }),
  usersController.create,
  ensureAdminOrProfessor
);

// --- ROTAS PROTEGIDAS PARA ADMIN ---

// Listar todos os usuários
usersRouter.get('/', isAuthenticated, ensureAdminOrProfessor, usersController.list);

// Ativar/Inativar um usuário
usersRouter.patch(
  '/:id/status',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
    [Segments.BODY]: { situacao: Joi.string().valid('ativo', 'inativo').required() },
  }),
  isAuthenticated,
  ensureAdminOrProfessor,
  usersController.updateStatus,
);

// Editar um usuário
usersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      nome: Joi.string(),
      usuario: Joi.string(),
      perfil: Joi.string().valid('admin', 'professor', 'aluno'),
      senha: Joi.string().min(6).optional(), // Senha é opcional na edição
    },
  }),
  isAuthenticated,
  ensureAdminOrProfessor,
  usersController.update,
);

// Deletar um usuário
usersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
  }),
  isAuthenticated,
  ensureAdmin,
  usersController.delete,
);

export default usersRouter;